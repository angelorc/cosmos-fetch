import { describe, expect, it } from "vitest";
import { cfetch } from "../src";

interface StakingParams {
  params: {
    unbonding_time: string;
    max_validators: number;
    max_entries: number;
    historical_entries: number;
    bond_denom: string;
  };
}

describe("cosmos-fetcher", () => {
  it("should fetch staking params from bitsong", async () => {
    const response = await cfetch<StakingParams>(
      "/cosmos/staking/v1beta1/params",
      { chain: "bitsong" },
    );
    expect(response.params.bond_denom).toBe("ubtsg");
  });
});
