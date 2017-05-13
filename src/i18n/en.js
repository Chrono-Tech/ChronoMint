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
    remove: 'Remove',
    error: 'Error'
  },
  operations: {
    pending: 'Pending',
    completed: 'Completed',
    desc: 'Description',
    signs: 'Signatures remained',
    sign: 'Sign',
    revoke: 'Revoke',
    emptyPendingList: 'No pending operations.',
    errors: {
      duplicate: 'This transaction is already added to the multi-signature operations list.'
    }
  },
  tx: {
    UserManager: {
      addCBE: {
        title: 'Add CBE',
        name: 'Name',
        address: 'Address'
      },
      revokeCBE: {
        title: 'Revoke CBE',
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
  }
}
