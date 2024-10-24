import { beforeAll, describe, expect, it } from "vitest";
import { createFetch, CosmosFetch, restApisFromChainRegistry, createStorage } from "../src";
import fsDriver from "unstorage/drivers/fs";

const cfetch: Map<string, CosmosFetch> = new Map();

const bankSendEnabled = {
  case: 'should fetch bank params',
  url: '/cosmos/bank/v1beta1/params',
  expected: { params: { default_send_enabled: true } }
}

const stakingParamBondDenom = (bondDenom: string) => ({
  case: 'should fetch staking params',
  url: '/cosmos/staking/v1beta1/params',
  expected: { params: { bond_denom: bondDenom } }
});

const testCases = {
  'bitsong': { tests: [bankSendEnabled, stakingParamBondDenom('ubtsg')] },
  'omniflixhub': { tests: [bankSendEnabled], exclude: ['https://omniflix-rest.kingnodes.com'] },
  'axelar': { tests: [bankSendEnabled] },
  // 'bandchain': { tests: [bankSendEnabled] },
  // 'bitcanna': { tests: [bankSendEnabled] },
  // 'cheqd': { tests: [bankSendEnabled] },
  // 'desmos': { tests: [bankSendEnabled] },
  // 'dydx': { tests: [bankSendEnabled] },
  // 'evmos': { tests: [bankSendEnabled] },
  // 'injective': { tests: [bankSendEnabled] },
  // 'kava': { tests: [bankSendEnabled] },
  // 'terra': { tests: [bankSendEnabled, stakingParamBondDenom('uluna')] },
  // 'terra2': { tests: [bankSendEnabled, stakingParamBondDenom('uluna')] },
  // 'cosmoshub': { tests: [bankSendEnabled, stakingParamBondDenom('uatom')] },
  // 'osmosis': { tests: [bankSendEnabled, stakingParamBondDenom('uosmo')] },
  // 'juno': { tests: [bankSendEnabled, stakingParamBondDenom('ujuno')], exclude: ['https://lcd-juno.itastakers.com'] },
  // 'chihuahua': { tests: [bankSendEnabled, stakingParamBondDenom('uhuahua')] },
  // 'agoric': { tests: [bankSendEnabled, stakingParamBondDenom('ubld')] },
  // 'akash': { tests: [bankSendEnabled, stakingParamBondDenom('uakt')] },
  // 'sei': { tests: [bankSendEnabled, stakingParamBondDenom('usei')] },
}

describe("cosmos-fetcher", () => {
  beforeAll(async () => {
    for (const chain of Object.keys(testCases)) {
      const baseURLs = await restApisFromChainRegistry({
        chain,
        exclude: testCases[chain].exclude,
        cache: {
          storage: createStorage({ driver: fsDriver({ base: '.cache' }) }),
          options: { maxAge: 60 * 60 }
        },
        sortByLatency: true
      })

      cfetch.set(chain, createFetch({ baseURLs }));
    }
  }, 100_000);

  for (const chain of Object.keys(testCases)) {
    describe(chain, () => {
      for (const { case: _case, url, expected } of testCases[chain].tests) {
        it(_case, async () => {
          try {
            const response = await cfetch.get(chain)!(url);
            expect(response).toMatchObject(expected);
          } catch (error) {
            throw new Error(`Failed to fetch ${url} from ${chain}: ${error}`);
          }
        });
      }
    });
  }
});
