import { $fetch, FetchRequest } from "ofetch";
import {
  BlacklistedItem,
  CacheItem,
  CreateCosmosFetchOptions,
  Endpoint,
} from "./types";
import { calculateLatency, chain, sortByLatency, stripEndSlash } from "./utils";
import { createStorage } from "unstorage";

export * from "./types";
export * from "./utils";

export async function cfetch<T>(
  request: FetchRequest,
  options?: CreateCosmosFetchOptions,
): Promise<T> {
  options = {
    ...options,
    chain: options?.chain || "cosmoshub",
    fetch: {
      ...options?.fetch,
      timeout: options?.fetch?.timeout || 500,
      retry: options?.fetch?.retry || 3,
      retryDelay: options?.fetch?.retryDelay || 100,
    },
    cache: options?.cache || createStorage(),
  };

  const chainInfo = await chain(options.chain, options.cache, { maxAge: 100 });
  if (!chainInfo) {
    throw new Error("Invalid chain name");
  }

  const lcdWithLatency = await Promise.all(
    chainInfo
      .apis!.rest!.map((api) => api.address)
      .map(
        (lcd) =>
          calculateLatency(lcd, {
            fetch: { timeout: 1000 },
            cache: { storage: options.cache, options: { maxAge: 100 } },
          }) || { url: stripEndSlash(lcd), latency: 9999, isDown: true },
      ),
  );

  const endpoints = sortByLatency(
    lcdWithLatency.filter(
      (endpoint) => endpoint?.url !== undefined,
    ) as Endpoint[],
  ).filter((endpoint) => !endpoint.isDown);

  for (const endpoint of endpoints) {
    const blacklistedItem = await options.cache!.getItem<
      CacheItem<BlacklistedItem>
    >(`blacklisted:${endpoint.url}`);

    if (blacklistedItem) {
      if (blacklistedItem.expires < Date.now()) {
        await options.cache!.removeItem(`blacklisted:${endpoint.url}`);
      } else {
        continue;
      }
    }

    options.fetch = {
      ...options.fetch,
      baseURL: endpoint.url,
    };

    try {
      return (await $fetch(request, options.fetch)) as T;
    } catch {
      console.error(`failed to fetch from ${endpoint.url}`);

      await options.cache!.setItem<CacheItem<BlacklistedItem>>(
        `blacklisted:${endpoint.url}`,
        {
          expires: Date.now() + 60 * 60 * 1000, // 1 hour
          value: { reason: "down" },
        },
      );
    }
  }

  throw new Error("All nodes are down");
}

export { createStorage } from "unstorage";