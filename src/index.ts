import { $fetch, FetchRequest } from "ofetch";
import {
  BlacklistedItem,
  CacheItem,
  CreateCosmosFetchOptions,
  Endpoint,
} from "./types";
import {
  calculateLatency,
  getChain,
  sortByLatency,
  stripEndSlash,
} from "./utils";
import { createStorage } from "unstorage";

export * from "./types";
export * from "./utils";

export async function cfetch<T>(
  request: FetchRequest,
  options?: CreateCosmosFetchOptions,
): Promise<T> {
  const {
    chain,
    endpoints,
    fetch: { timeout = 500, retry = 3, retryDelay = 100 } = {},
    cache = createStorage(),
  } = options || {};

  const _chain = chain ?? (endpoints?.length ? undefined : "cosmoshub");
  let _endpoints: Endpoint[];

  if (endpoints?.length) {
    _endpoints = endpoints.map((url) => ({
      url: stripEndSlash(url),
      latency: 0,
      isDown: false,
    }));
  } else {
    const chainInfo = await getChain(_chain!, cache, { maxAge: 100 });
    if (!chainInfo) {
      throw new Error("Invalid chain name");
    }

    const lcdWithLatency = await Promise.all(
      chainInfo.apis?.rest
        ?.map((api) => api.address)
        .map(async (lcd) => {
          const latencyResult = await calculateLatency(lcd, {
            fetch: { timeout: 1000 },
            cache: { storage: cache, options: { maxAge: 100 } },
          });

          return (
            latencyResult || {
              url: stripEndSlash(lcd),
              latency: 9999,
              isDown: true,
            }
          );
        }) ?? [],
    );

    _endpoints = sortByLatency(
      lcdWithLatency.filter(
        (endpoint): endpoint is Endpoint => endpoint?.url !== undefined,
      ),
    ).filter((endpoint) => !endpoint.isDown);
  }

  for (const endpoint of _endpoints) {
    const cacheKey = `blacklisted:${endpoint.url}`;
    const blacklistedItem =
      await cache.getItem<CacheItem<BlacklistedItem>>(cacheKey);

    if (blacklistedItem) {
      if (blacklistedItem.expires < Date.now()) {
        await cache.removeItem(cacheKey);
      } else {
        continue;
      }
    }

    try {
      const response = await $fetch(request, {
        timeout,
        retry,
        retryDelay,
        baseURL: endpoint.url,
      });

      return response as T;
    } catch {
      console.error(`failed to fetch from ${endpoint.url}`);

      await cache.setItem<CacheItem<BlacklistedItem>>(cacheKey, {
        expires: Date.now() + 60 * 60 * 1000, // 1 hour
        value: { reason: "down" },
      });
    }
  }

  throw new Error("All nodes are down");
}

export function createCosmosFetch(options?: CreateCosmosFetchOptions) {
  return async function <T>(
    request: FetchRequest,
    override?: Partial<CreateCosmosFetchOptions>,
  ): Promise<T> {
    const _options = {
      ...options,
      ...override,
      fetch: {
        ...options?.fetch,
        ...override?.fetch,
      },
    };

    return cfetch<T>(request, _options);
  };
}

export { createStorage } from "unstorage";
