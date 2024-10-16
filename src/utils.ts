import { ofetch } from "ofetch";
import { GithubFileName } from "./types";
import { Chain } from "./chain.schema";

// https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/bitsong/chain.json

export const crfetch = (chainName: string, fileName: GithubFileName = 'chain') => {
    if (fileName === 'assetlist') {
        throw new Error('Not implemented')
    }

    const _fetch = ofetch.create({
        baseURL: "https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/" + chainName,
    })

    return _fetch<Chain>(`/${fileName}.json`, { responseType: 'json' })
}