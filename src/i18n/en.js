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
    view: 'View',
    remove: 'Remove'
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
    action: 'Action'
  },
  operations: {
    pending: 'Pending',
    completed: 'Completed',
    desc: 'Description',
    signs: 'Signatures remained',
    sign: 'Sign',
    revoke: 'Revoke'
  },
  tx: {
    transactions: 'Transactions',
    blockNumber: 'Block Number',
    loadMore: 'Load More – From %{block} Block',
    noTransactions: 'No transactions',
    UserManager: {
      addCBE: {
        title: 'Add CBE',
        name: 'Name',
        address: 'Address'
      },
      setRequired: {
        title: 'Set Required Signatures',
        _required: 'Quantity'
      }
    },
    ContractsManager: {
      setOtherAddress: {
        title: 'Add Contract',
        value: 'Address'
      },
      setAddress: {
        title: 'Add Token',
        value: 'Address'
      }
    }
  },
  errors: {
    cantSentToYourself: 'Can\'t send tokens to yourself',
    noTokens: 'No tokens',
    notEnoughTokens: 'Not enough tokens'
  }
}
