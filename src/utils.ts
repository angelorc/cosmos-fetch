import { $fetch } from "ofetch";
import { Chain } from "./chain.schema";

// https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/bitsong/chain.json

export const chain = (chainName: string) => $fetch<Chain>(`/chain.json`, {
    responseType: 'json',
    baseURL: "https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/" + chainName
})