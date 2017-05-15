import * as user from '../dao/UserDAO'
import * as tokens from '../dao/TokenContractsDAO'
import * as contracts from '../dao/OtherContractsDAO'
import * as vote from '../dao/VoteDAO'

export default {
  nav: {
    project: 'ChronoMint',
    dashboard: 'CBE Dashboard',
    locs: 'LOC Admin',
    lhOperations: 'LH Operations',
    operations: 'Operations',
    settings: 'Settings',
    wallet: 'Wallet',
    exchange: 'Exchange',
    voting: 'Voting',
    rewards: 'Rewards',
    profile: 'Profile',
    signOut: 'Sign out',
    search: 'Search...',
    actions: 'Actions',
    save: 'Save',
    cancel: 'Cancel',
    view: 'View',
    remove: 'Remove',
    error: 'Error'
  },
  wallet: {
    sendTokens: 'Send tokens',
    recipientAddress: 'Recipient address'
  },
  exchange: {
    tokens: 'Exchange tokens',
    rates: 'Exchange rates',
    exchange: 'Exchange',
    buyPrice: 'Buy price',
    sellPrice: 'Sell price'
  },
  // common one-word terms
  terms: {
    account: 'Account',
    amount: 'Amount',
    currency: 'Currency',
    asset: 'Asset',
    hash: 'Hash',
    time: 'Time',
    value: 'Value',
    buying: 'Buying',
    selling: 'Selling',
    block: 'Block',
    action: 'Action',
    balances: 'Balances',
    fee: 'Fee',
    send: 'Send'
  },
  operations: {
    pending: 'Pending',
    completed: 'Completed',
    settings: 'Operations settings',
    desc: 'Description',
    signs: 'Signatures remained',
    sign: 'Sign',
    revoke: 'Revoke',
    emptyPendingList: 'No pending operations.',
    adminCount: 'Number of CBE',
    requiredSigns: 'Required signatures',
    errors: {
      duplicate: 'This transaction is already added to the multi-signature operations list.',
      requiredSigns: 'Required signatures number should not exceed number of CBE.'
    }
  },
  tx: {
    transactions: 'Transactions',
    blockNumber: 'Block Number',
    loadMore: 'Load More – From %{block} Block',
    noTransactions: 'No transactions',
    UserManager: {
      [user.FUNC_ADD_CBE]: {
        title: 'Add CBE',
        name: 'Name',
        address: 'Address'
      },
      [user.FUNC_REVOKE_CBE]: {
        title: 'Revoke CBE',
        name: 'Name',
        address: 'Address'
      },
      [user.FUNC_SET_REQUIRED_SIGNS]: {
        title: 'Set Required Signatures',
        _required: 'Quantity'
      }
    },
    ContractsManager: {
      // token contracts
      [tokens.FUNC_SET_ADDRESS]: {
        title: 'Add Token',
        value: 'Address'
      },
      [tokens.FUNC_CHANGE_ADDRESS]: {
        title: 'Modify Token',
        _from: 'From',
        _to: 'To'
      },
      [tokens.FUNC_REMOVE_ADDRESS]: {
        title: 'Remove Token',
        value: 'Address'
      },

      // assets
      [tokens.FUNC_REVOKE_ASSET]: {
        title: 'Revoke Asset',
        symbol: 'Token',
        value: 'Value',
        loc: 'LOC'
      },
      [tokens.FUNC_REISSUE_ASSET]: {
        title: 'Reissue Asset',
        symbol: 'Token',
        value: 'Value',
        loc: 'LOC'
      },

      // common
      [tokens.FUNC_CLAIM_CONTRACT_OWNERSHIP]: {
        title: 'Claim Contract Ownership',
        address: 'Address'
      },

      // other contracts
      [contracts.FUNC_SET_OTHER_ADDRESS]: {
        title: 'Add Contract',
        value: 'Address'
      },
      [contracts.FUNC_REMOVE_OTHER_ADDRESS]: {
        title: 'Remove Contract',
        value: 'Address'
      }
    },
    Vote: {
      [vote.FUNC_ADMIN_END_POLL]: {
        title: 'End Poll',
        id: 'Id'
      },
      [vote.FUNC_ACTIVATE_POLL]: {
        title: 'Activate Poll',
        id: 'Id'
      }
    }
  },
  errors: {
    cantSentToYourself: 'Can\'t send tokens to yourself',
    notEnoughTokens: 'Not enough tokens',
    invalidCurrencyNumber: 'Can have only 2 decimal places',
    invalidPositiveNumber: 'Should be positive integer',
    invalidURL: 'Should be valid URL',
    invalidEmail: 'Should be valid email address',
    invalidLength: 'Should have length more than or equal 3 symbols',
    invalidAddress: 'Should be valid ethereum address',
    required: 'Required',
    greaterThanAllowed: 'Amount is greater than allowed',
    lowerThan: 'Should be lower than %{limit}',
    greaterOrEqualBuyPrice: 'Should be greater than or equal buy price'
  }
}
