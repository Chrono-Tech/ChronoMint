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
  }
}
