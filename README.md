# cosmos-fetch

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/cosmos-fetch?color=yellow)](https://npmjs.com/package/cosmos-fetch)
[![npm downloads](https://img.shields.io/npm/dm/cosmos-fetch?color=yellow)](https://npm.chart.dev/cosmos-fetch)

<!-- /automd -->

An advanced fetch for cosmos blockchains. Support `cosmos-registry` caching, retries, and more.

## Usage

Install package:

<!-- automd:pm-install -->

```sh
# ✨ Auto-detect
npx nypm install cosmos-fetch

# npm
npm install cosmos-fetch

# yarn
yarn add cosmos-fetch

# pnpm
pnpm install cosmos-fetch

# bun
bun install cosmos-fetch

# deno
deno install cosmos-fetch
```

<!-- /automd -->

Import:

<!-- automd:jsimport cjs cdn name="cosmos-fetch" imports="cfetch" -->

**ESM** (Node.js, Bun, Deno)

```js
import { cfetch } from "cosmos-fetch";
```

**CommonJS** (Legacy Node.js)

```js
const { cfetch } = require("cosmos-fetch");
```

**CDN** (Deno, Bun and Browsers)

```js
import { cfetch } from "https://esm.sh/cosmos-fetch";
```

<!-- /automd -->

## Examples

### Without caching

```js
import { cfetch } from "cosmos-fetch";

// Fetch staking params from cosmoshub
const response = await cfetch("/cosmos/staking/v1beta1/params");

// Fetch staking params from bitsong
const response = await cfetch("/cosmos/staking/v1beta1/params", {
  chain: "bitsong",
});
```

### With caching (highly recommended)

```js
import { cfetch, createStorage, fsDriver } from "cosmos-fetch";

// Use local filesystem as cache
const cache = createStorage({ driver: fsDriver({ base: "./.cache" }) });

// Fetch staking params from cosmoshub
const response = await cfetch("/cosmos/staking/v1beta1/params", {
  chain: "bitsong",
  cache,
});
```

## Development

<details>

<summary>local development</summary>

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

</details>

## License

<!-- automd:contributors license=MIT -->

Published under the [MIT](https://github.com/angelorc/cosmos-fetch/blob/main/LICENSE) license.
Made by [community](https://github.com/angelorc/cosmos-fetch/graphs/contributors) 💛
<br><br>
<a href="https://github.com/angelorc/cosmos-fetch/graphs/contributors">
<img src="https://contrib.rocks/image?repo=angelorc/cosmos-fetch" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
