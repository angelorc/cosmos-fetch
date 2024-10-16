import { describe, expect, it } from "vitest";
import { CosmosBankSupplyResponse, createCosmosFetch, crfetch } from "../src";
import type { Chain } from "../src/chain.schema";
import { $fetch } from "ofetch";

describe("packageName", () => {
  it("should fetch supply from bitsong", async () => {
    const cfetch = createCosmosFetch({ chainName: "bitsong" });

    const response = await cfetch<CosmosBankSupplyResponse>('/cosmos/bank/v1beta1/supply')
    response.supply.forEach((supply) => {
      expect(supply.denom).toBeDefined();
      expect(supply.amount).toBeDefined();
    })
  })
});
