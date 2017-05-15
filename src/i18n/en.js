import * as user from '../dao/UserDAO'
import * as tokens from '../dao/TokenContractsDAO'
import * as contracts from '../dao/OtherContractsDAO'
import * as vote from '../dao/VoteDAO'
import * as asset from '../dao/AbstractProxyDAO'
import * as operations from '../dao/OperationsDAO'
import * as exchange from '../dao/ExchangeDAO'
import * as time from '../dao/TIMEHolderDAO'

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
  notices: {
    tx: {
      processing: 'Transaction is processing...'
    },
    operations: {
      confirmed: 'Operation confirmed, signatures remained: %{remained}',
      revoked: 'Operation revoked, signatures remained: %{remained}',
      cancelled: 'Operation cancelled.'
    }
  },
  tx: {
    transactions: 'Transactions',
    blockNumber: 'Block Number',
    loadMore: 'Load More – From %{block} Block',
    noTransactions: 'No transactions',
    UserManager: {
      [user.TX_ADD_CBE]: {
        title: 'Add CBE',
        name: 'Name',
        address: 'Address'
      },
      [user.TX_REVOKE_CBE]: {
        title: 'Revoke CBE',
        name: 'Name',
        address: 'Address'
      },
      [user.TX_SET_REQUIRED_SIGNS]: {
        title: 'Set Required Signatures',
        _required: 'Quantity'
      },
      [user.TX_SET_OWN_HASH]: {
        name: 'Name',
        email: 'E-mail',
        company: 'Company'
      },
      [user.TX_SET_MEMBER_HASH]: {
        address: 'Address',
        name: 'Name',
        email: 'Email',
        company: 'Company'
      }
    },
    ContractsManager: {
      // token contracts
      [tokens.TX_SET_ADDRESS]: {
        title: 'Add Token',
        address: 'Address',
        name: 'Name'
      },
      [tokens.TX_CHANGE_ADDRESS]: {
        title: 'Modify Token',
        _from: 'From',
        _to: 'To'
      },
      [tokens.TX_REMOVE_ADDRESS]: {
        title: 'Remove Token',
        address: 'Address',
        name: 'Name'
      },

      // assets
      [tokens.TX_SEND_ASSET]: {
        title: 'Send Asset',
        asset: 'Asset',
        address: 'Address',
        amount: 'Amount'
      },
      [tokens.TX_REVOKE_ASSET]: {
        title: 'Revoke Asset',
        symbol: 'Token',
        value: 'Value',
        loc: 'LOC'
      },
      [tokens.TX_REISSUE_ASSET]: {
        title: 'Reissue Asset',
        symbol: 'Token',
        value: 'Value',
        loc: 'LOC'
      },
      [tokens.TX_REQUIRE_TIME]: {
        title: 'Require TIME'
      },

      // common
      [tokens.TX_CLAIM_CONTRACT_OWNERSHIP]: {
        title: 'Claim Contract Ownership',
        address: 'Address'
      },

      // other contracts
      [contracts.TX_SET_OTHER_ADDRESS]: {
        title: 'Add Contract',
        address: 'Address',
        name: 'Name'
      },
      [contracts.TX_REMOVE_OTHER_ADDRESS]: {
        title: 'Remove Contract',
        address: 'Address',
        name: 'Name'
      },
      [contracts.TX_FORWARD]: {
        contract: 'Contract',
        address: 'Address',

        [exchange.TX_SET_PRICES]: 'Set Prices',
        buyPrice: 'Buy Price',
        sellPrice: 'Sell Price'
      }
    },
    Vote: {
      [vote.TX_ADMIN_END_POLL]: {
        title: 'End Poll',
        id: 'Id'
      },
      [vote.TX_ACTIVATE_POLL]: {
        title: 'Activate Poll',
        id: 'Id'
      }
    },
    ChronoBankAssetProxy: {
      [asset.TX_APPROVE]: {
        title: 'Approve TIME',
        account: 'Account',
        amount: 'Amount'
      },
      [asset.TX_TRANSFER]: {
        title: 'Transfer TIME',
        recipient: 'Recipient',
        amount: 'Amount'
      }
    },
    ChronoBankAssetWithFeeProxy: {
      [asset.TX_APPROVE]: {
        title: 'Approve LHT',
        account: 'Account',
        amount: 'Amount'
      },
      [asset.TX_TRANSFER]: {
        title: 'Transfer LHT',
        recipient: 'Recipient',
        amount: 'Amount'
      }
    },
    PendingManager: {
      [operations.TX_CONFIRM]: {
        title: 'Confirm Operation'
      },
      [operations.TX_REVOKE]: {
        title: 'Revoke Operation'
      }
    },
    TimeHolder: {
      [time.TX_DEPOSIT]: {
        title: 'Deposit TIME',
        amount: 'Amount'
      },
      [time.TX_WITHDRAW_SHARES]: {
        title: 'Withdraw TIME',
        amount: 'Amount'
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
