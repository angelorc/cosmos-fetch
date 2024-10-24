import { StorageValue, Storage } from "unstorage";

export type Endpoint = { url: string; latency: number; isDown: boolean };

export type CacheItem<T> = {
  expires: number;
  value: T;
};

export interface CacheOptions {
  maxAge?: number;
}

export interface CacheParams {
  storage?: Storage<StorageValue>;
  options?: CacheOptions;
}

// export interface CreateCosmosFetchOptions {
//   chain: string;
//   fetch?: FetchOptions;
//   cache?: Storage<StorageValue> | undefined;
// }

// export type BlacklistedItem = { reason: string };