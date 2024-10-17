export const protoApi = {
  query: {
    accounts: () => "/cosmos/auth/v1beta1/accounts",
    account: (address) => `/cosmos/auth/v1beta1/accounts/${address}`,
    params: () => "/cosmos/auth/v1beta1/params",
    moduleAccountByName: (name) => `/cosmos/auth/v1beta1/module_accounts/${name}`,
  },
};
