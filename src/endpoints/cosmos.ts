export const cosmos = {
  rpc: {},
  rest: {
    auth: {
      v1beta1: {
        accounts: () => `/cosmos/auth/v1beta1/accounts`,
        account: (address: string) => `/cosmos/auth/v1beta1/accounts/${address}`,
        params: () => `/cosmos/auth/v1beta1/params`,
        module_account: (name: string) => `/cosmos/auth/v1beta1/module_accounts/${name}`,
      }
    },
    authz: {
      v1beta1: {
        grants: () => `/cosmos/authz/v1beta1/grants`,
        granter_grants: (granter: string) => `/cosmos/authz/v1beta1/grants/granter/${granter}`,
        grantee_grants: (grantee: string) => `/cosmos/authz/v1beta1/grants/grantee/${grantee}`,
      }
    },
    bank: {
      v1beta1: {
        // cosmos-sdk v0.45
        balance: (address: string) => `/cosmos/bank/v1beta1/balances/${address}/by_denom`,
        all_balances: (address: string) => `/cosmos/bank/v1beta1/balances/${address}`,
        spendable_balances: (address: string) => `/cosmos/bank/v1beta1/spendable_balances/${address}`,
        total_supply: () => `/cosmos/bank/v1beta1/supply`,
        supply_of: (denom: string) => `/cosmos/bank/v1beta1/supply/${denom}`,
        params: () => `/cosmos/bank/v1beta1/params`,
        denom_metadata: (denom: string) => `/cosmos/bank/v1beta1/denoms_metadata/${denom}`,
        denoms_metadata: () => `/cosmos/bank/v1beta1/denoms_metadata`,
      }
    },
    base: {
      node: {
        v1beta1: {
          config: () => `/cosmos/base/node/v1beta1/config`,
        }
      },
      reflection: {
        v1beta1: {
          list_all_interfaces: () => `/cosmos/base/reflection/v1beta1/interfaces`,
          list_implementations: (interface_name: string) => `/cosmos/base/reflection/v1beta1/interfaces/${interface_name}/implementations`,
        },
        v2alpha1: {
          get_authn_descriptor: () => `/cosmos/base/reflection/v1beta1/app_descriptor/authn`,
          get_chain_descriptor: () => `/cosmos/base/reflection/v1beta1/app_descriptor/chain`,
          get_codec_descriptor: () => `/cosmos/base/reflection/v1beta1/app_descriptor/codec`,
          get_configuration_descriptor: () => `/cosmos/base/reflection/v1beta1/app_descriptor/configuration`,
          get_query_services_descriptor: () => `/cosmos/base/reflection/v1beta1/app_descriptor/query_services`,
          get_tx_descriptor: () => `/cosmos/base/reflection/v1beta1/app_descriptor/tx_descriptor`,
        }
      },
      tendermint: {
        v1beta1: {
          get_node_info: () => `/cosmos/base/tendermint/v1beta1/node_info`,
          get_syncing: () => `/cosmos/base/tendermint/v1beta1/syncing`,
          get_latest_block: () => `/cosmos/base/tendermint/v1beta1/blocks/latest`,
          get_block_by_height: (height: string) => `/cosmos/base/tendermint/v1beta1/blocks/${height}`,
          get_latest_validator_set: () => `/cosmos/base/tendermint/v1beta1/validatorsets/latest`,
          get_validator_set_by_height: (height: string) => `/cosmos/base/tendermint/v1beta1/validatorsets/${height}`,
        }
      }
    },
    distribution: {
      v1beta1: {
        params: () => `/cosmos/distribution/v1beta1/params`,
        validator_outstanding_rewards: (validator_address: string) => `/cosmos/distribution/v1beta1/validators/${validator_address}/outstanding_rewards`,
        validator_commission: (validator_address: string) => `/cosmos/distribution/v1beta1/validators/${validator_address}/commission`,
        validator_slashes: (validator_address: string) => `/cosmos/distribution/v1beta1/validators/${validator_address}/slashes`,
        delegation_rewards: (delegator_address: string, validator_address: string) => `/cosmos/distribution/v1beta1/delegators/${delegator_address}/rewards/${validator_address}`,
        delegation_total_rewards: (delegator_address: string) => `/cosmos/distribution/v1beta1/delegators/${delegator_address}/rewards`,
        delegator_validators: (delegator_address: string) => `/cosmos/distribution/v1beta1/delegators/${delegator_address}/validators`,
        delegator_withdraw_address: (delegator_address: string) => `/cosmos/distribution/v1beta1/delegators/${delegator_address}/withdraw_address`,
        community_pool: () => `/cosmos/distribution/v1beta1/community_pool`,
      }
    },
    evidence: {
      v1beta1: {
        evidence: (evidence_hash: string) => `/cosmos/evidence/v1beta1/evidence/${evidence_hash}`,
        all_evidence: () => `/cosmos/evidence/v1beta1/evidence`,
      }
    },
    feegrant: {
      v1beta1: {
        allowance: (granter: string, grantee: string) => `/cosmos/feegrant/v1beta1/allowance/${granter}/${grantee}`,
        allowances: (grantee: string) => `/cosmos/feegrant/v1beta1/allowances/${grantee}`,
        allowances_by_granter: (granter: string) => `/cosmos/feegrant/v1beta1/issued/${granter}`,
      }
    },
    gov: {
      v1beta1: {
        proposal: (proposal_id: string) => `/cosmos/gov/v1beta1/proposals/${proposal_id}`,
        proposals: () => `/cosmos/gov/v1beta1/proposals`,
        vote: (proposal_id: string, voter: string) => `/cosmos/gov/v1beta1/proposals/${proposal_id}/votes/${voter}`,
        votes: (proposal_id: string) => `/cosmos/gov/v1beta1/proposals/${proposal_id}/votes`,
        params: (params_type: string) => `/cosmos/gov/v1beta1/params/${params_type}`,
        deposit: (proposal_id: string, depositor: string) => `/cosmos/gov/v1beta1/proposals/${proposal_id}/deposits/${depositor}`,
        deposits: (proposal_id: string) => `/cosmos/gov/v1beta1/proposals/${proposal_id}/deposits`,
        tally_result: (proposal_id: string) => `/cosmos/gov/v1beta1/proposals/${proposal_id}/tally`,
      }
    }
  },
}