import { $fetch, FetchOptions } from "ofetch";
import { Chain } from "./chain.schema";
import { createStorage } from "unstorage";
import {
  CacheItem,
  CacheOptions,
  CalculateLatencyOptions,
  LatencyResponse,
} from "./types";

export const chain = async (
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
      console.log(`remove expired cache for chain ${chainName}`);
      await cache.removeItem(`chain:${chainName}`);
    } else {
      console.log(`use cached chain info for ${chainName}`);
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

export function sortByLatency(
  endpoints: {
    url: string;
    latency: number;
    isDown: boolean;
  }[],
) {
  return endpoints.sort((a, b) => a.latency - b.latency);
}

const defaultFetchOptions: FetchOptions = {
  timeout: 500,
  retry: 3,
  retryDelay: 100,
};

const defaultCacheOptions: CacheOptions = {
  maxAge: 100,
};

export const calculateLatency = async (
  url: string,
  options?: CalculateLatencyOptions,
) => {
  options = {
    fetch: {
      ...defaultFetchOptions,
      ...options?.fetch,
    },
    cache: {
      storage: options?.cache?.storage || createStorage(),
      options: {
        ...defaultCacheOptions,
        ...options?.cache?.options,
      },
    },
  };

  const ttl = (options.cache?.options?.maxAge ?? 0) * 1000;
  const cachedItem = await options.cache?.storage?.getItem<CacheItem<Chain>>(
    `latency:${url}`,
  );

  if (cachedItem) {
    if (cachedItem.expires < Date.now()) {
      console.log(`remove expired cache latency for ${url}`);
      await options.cache?.storage?.removeItem(`latency:${url}`);
    } else {
      console.log(`use cached latency for ${url}`);
      return cachedItem.value;
    }
  }

  const startTime = Date.now();

  try {
    const node = new URL("/cosmos/bank/v1beta1/params", url);
    const response = await $fetch.raw(node.toString(), options.fetch);
    if (response.status !== 200) {
      throw new Error("Invalid status code");
    }
    const endTime = Date.now();
    const latency = endTime - startTime;
    const data: LatencyResponse = {
      url: stripEndSlash(url),
      latency,
      isDown: false,
    };

    await options.cache?.storage?.setItem<CacheItem<LatencyResponse>>(
      `latency:${url}`,
      {
        expires: Date.now() + ttl,
        value: data,
      },
    );

    return data;
  } catch {
    const data: LatencyResponse = {
      url: stripEndSlash(url),
      latency: 9999,
      isDown: true,
    };

    await options.cache?.storage?.setItem<CacheItem<LatencyResponse>>(
      `latency:${url}`,
      {
        expires: Date.now() + ttl,
        value: data,
      },
    );

    return data;
  }
};

export function stripEndSlash(url: string) {
  return url.replace(/\/$/, "");
}
