import { FetchOptions, ofetch } from "ofetch";
import { CreateCosmosFetchOptions } from "./types";

export {
  CreateCosmosFetchOptions,
  Pagination,
  CosmosBankSupply,
  CosmosBankSupplyResponse
} from "./types";

export { crfetch } from "./utils";

export function createCosmosFetch(options: CreateCosmosFetchOptions) {
  options = {
    chainName: "bitsong",
  };

  const fetchOptions: FetchOptions = {
    baseURL: `https://lcd.explorebitsong.com`,
  }

  return ofetch.create(fetchOptions)
}