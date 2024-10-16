import { FetchOptions } from "ofetch";
import { StorageValue, Storage } from "unstorage";

export interface CreateCosmosFetchOptions {
  chain: string;
  fetch?: FetchOptions;
  cache?: Storage<StorageValue> | undefined;
}

export type Endpoint = { url: string; latency: number; isDown: boolean };

export type BlacklistedItem = { reason: string };

export type CacheItem<T> = {
  expires: number;
  value: T;
};

export interface CacheOptions {
  maxAge?: number;
}

export type LatencyResponse = {
  url: string;
  latency: number;
  isDown: boolean;
};

export interface CalculateLatencyOptions {
  fetch?: FetchOptions;
  cache?: {
    storage?: Storage<StorageValue>;
    options?: CacheOptions;
  };
}
