import { cfetch, createStorage } from "../src";
import { fsDriver } from "../src/drivers";

const response = await cfetch("/cosmos/staking/v1beta1/params", {
  chain: "bitsong",
  cache: createStorage({ driver: fsDriver({ base: "./.cache" }) }),
});

console.log(response);
