import { $fetch, FetchOptions } from "ofetch";
import { Chain } from "./chain.schema";
import { createStorage } from "unstorage";
import type { CacheItem, CacheOptions, CacheParams } from "./types";
import { Agent, request } from "undici";

const defaultFetchOptions: FetchOptions = {
  timeout: 500,
  retry: 3,
  retryDelay: 100,
};

const defaultCacheOptions: CacheOptions = {
  maxAge: 100,
};

export const getChain = async (
  chainName: string,
  cache = createStorage(),
  opts: CacheOptions = {},
) => {
  const ttl = (opts.maxAge ?? 0) * 1000;
  const cachedItem = await cache.getItem<CacheItem<Chain>>(
    `chain:${chainName}`,
  );

  if (cachedItem) {
    if (cachedItem.expires < Date.now()) {
      await cache.removeItem(`chain:${chainName}`);
    } else {
      return cachedItem.value;
    }
  }

  try {
    const response = await $fetch<Chain>(`/chain.json`, {
      responseType: "json",
      baseURL:
        "https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/" +
        chainName,
    });

    await cache.setItem<CacheItem<Chain>>(`chain:${chainName}`, {
      expires: Date.now() + ttl,
      value: response,
    });

    return response;
  } catch {
    throw new Error("Invalid chain name");
  }
};

export const restApisFromChainRegistry = async ({
  chain,
  include,
  exclude,
  cache,
  sortByLatency
}: {
  chain?: string,
  include?: string[],
  exclude?: string[],
  cache?: CacheParams;
  sortByLatency?: boolean,
}): Promise<string[]> => {
  cache = {
    storage: cache?.storage || createStorage(),
    options: {
      ...defaultCacheOptions,
      ...cache?.options,
    },
  }
  const ttl = (cache?.options?.maxAge ?? 0) * 1000;

  let endpoints = include?.map((address) => stripEndSlash(address)) || []

  if (chain) {
    const cachedItem = await cache?.storage?.getItem<CacheItem<string[]>>(
      `chain-registry:${chain}`,
    );

    if (cachedItem) {
      if (cachedItem.expires < Date.now()) {
        await cache?.storage?.removeItem(`chain-registry:${chain}`);
      } else {
        endpoints.push(...cachedItem.value.filter((address) => !endpoints.includes(address)))
      }
    } else {
      const chainInfo = await getChain(chain);
      if (chainInfo.apis?.rest) {
        const urls = chainInfo.apis?.rest.map(({ address }) => stripEndSlash(address))

        await cache?.storage?.setItem<CacheItem<string[]>>(`chain-registry:${chain}`, {
          expires: Date.now() + ttl,
          value: urls,
        })

        endpoints.push(...urls.filter((address) => !endpoints.includes(address)))
      }
    }
  }

  endpoints = endpoints.filter((address) => !exclude?.includes(stripEndSlash(address)))

  if (sortByLatency) {
    const cachedItem = await cache?.storage?.getItem<CacheItem<string[]>>(
      `sort-by-latency:${chain}`,
    );

    if (cachedItem) {
      if (cachedItem.expires < Date.now()) {
        await cache?.storage?.removeItem(`sort-by-latency:${chain}`);
      } else {
        return cachedItem.value;
      }
    }

    const urls = (await sortByLatencyFn(endpoints)).map(({ address }) => address)

    await cache?.storage?.setItem<CacheItem<string[]>>(`sort-by-latency:${chain}`, {
      expires: Date.now() + ttl,
      value: urls,
    })

    return urls
  }

  return endpoints;
}

export async function sortByLatencyFn(addresses: string[] | undefined): Promise<{
  address: string;
  latency: number;
}[]> {
  if (!addresses) {
    throw new Error("No addresses provided");
  }

  const promises = addresses.map(async (address) => {
    try {
      const start = Date.now();
      await request(address, {
        method: 'HEAD',
        dispatcher: new Agent({
          connectTimeout: 100,
          headersTimeout: 100,
          bodyTimeout: 500,
        }),
      });
      const latency = Date.now() - start;
      return { address, latency };
    } catch {
      return { address, latency: 9999 };
    }
  });

  const results = await Promise.all(promises);
  return results.sort((a, b) => a.latency - b.latency);
}

export function stripEndSlash(url: string) {
  return url.replace(/\/$/, "");
}
