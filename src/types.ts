import { z } from "zod";

export interface CreateCosmosFetchOptions {
  chainName: string;
}

export interface Pagination {
  next_key: string;
  total: string;
}

export interface CosmosBankSupply {
  denom: string;
  amount: string;
}

export interface CosmosBankSupplyResponse {
  supply: CosmosBankSupply[];
  pagination: Pagination;
}

export type GithubFileName = 'chain' | 'assetlist'