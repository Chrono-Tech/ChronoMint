import * as user from '../dao/UserManagerDAO'
import * as vote from '../dao/VoteDAO'
import * as erc20 from '../dao/ERC20DAO'
import * as operations from '../dao/PendingManagerDAO'
import * as time from '../dao/TIMEHolderDAO'
import * as rewards from '../dao/RewardsDAO'

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
    markupDashboard: 'Dashboard 2.0'
  },
  common: {
    name: 'Name',
    address: 'Address',
    ethAddress: 'Ethereum Address'
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
    sellPrice: 'Sell price',
    limits: 'Exchange limits'
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
    send: 'Send',
    search: 'Search',
    status: 'Status',
    website: 'Website',
    cancel: 'Cancel',
    sendS: 'Send %{s}',
    close: 'Close',
    save: 'Save',
    view: 'View',
    error: 'Error',
    pending: 'Pending',
    failed: 'Failed'
  },
  locs: {
    entries: '%{number} entries',
    sendToExchange: 'Send to exchange',
    recent: 'Recent LOCs',
    insuranceFee: 'Insurance fee',
    allowedToBeIssued: 'Allowed to be issued',
    expirationDate: 'Expiration Date',
    issuanceParameters: 'Issuance parameters',
    sendLHToExchange: 'Send LH to Exchange',
    uploadedFile: 'Uploaded File',
    issueLHT: 'Issue LHT',
    issueS: 'Issue %{asset}',
    // TODO @dkchv: avoid LHT in tokens
    redeemLHT: 'Redeem LHT',
    redeemS: 'Redeem %{asset}',
    title: 'LOC title',
    edit: 'Edit LOC',
    new: 'New LOC',
    delete: 'Delete LOC',
    save: 'Save changes',
    create: 'Create LOC',
    viewContract: 'View Contact',
    editInfo: 'Edit LOC Info',
    daysLeft: 'Days left',
    updateStatus: 'Update Status',
    forms: {
      amountToBeS: 'Amount to be %{action}',
      allowedToBeS: 'Allowed to be %{action} on behalf of %{name}: %{limit} %{currency}',
      actions: {
        issued: 'issued',
        redeemed: 'redeemed'
      }
    },
    notice: {
      message: 'LOC \'%{name}\' %{action}',
      added: 'Added',
      removed: 'Removed',
      updated: 'Updated',
      statusUpdated: 'Status updated',
      issued: 'Issued'
    },
    status: {
      maintenance: 'Maintenance',
      active: 'Active',
      suspended: 'Suspended',
      bankrupt: 'Bankrupt',
      inactive: 'Inactive'
    }
  },
  operations: {
    completed: 'Completed operations from last 6000 blocks',
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
  settings: {
    user: {
      title: 'User management',
      cbeAddresses: {
        title: 'CBE Addresses'
      }
    },
    erc20: {
      title: 'ERC20 tokens management',
      tokens: {
        title: 'Tokens',
        add: 'Add Token',
        modify: 'Modify Token',
        symbol: 'Symbol',
        url: 'Project URL',
        decimals: 'Decimals',
        icon: 'Icon (TODO)',
        errors: {
          invalidAddress: 'Can\'t find valid ERC20 contract by this address',
          symbolInUse: 'This symbol is already in use',
          invalidSymbol: 'Symbol can only contain from 2 to 4 A-Z letters'
        }
      }
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
        title: 'Update own profile',
        name: 'Name',
        email: 'E-mail',
        company: 'Company'
      },
      [user.TX_SET_MEMBER_HASH]: {
        title: 'Update profile',
        address: 'Address',
        name: 'Name',
        email: 'Email',
        company: 'Company'
      }
    },
    ContractsManager: {
      // token contracts
      // [tokens.TX_SET_ADDRESS]: {
      //   title: 'Add Token',
      //   address: 'Address',
      //   name: 'Name'
      // },
      // [tokens.TX_CHANGE_ADDRESS]: {
      //   title: 'Modify Token',
      //   _from: 'From',
      //   _to: 'To'
      // },
      // [tokens.TX_REMOVE_ADDRESS]: {
      //   title: 'Remove Token',
      //   address: 'Address',
      //   name: 'Name'
      // },
      //
      // // assets
      // [tokens.TX_SEND_ASSET]: {
      //   title: 'Send Asset',
      //   asset: 'Asset',
      //   address: 'Address',
      //   amount: 'Amount'
      // },
      // [tokens.TX_REVOKE_ASSET]: {
      //   title: 'Revoke Asset',
      //   symbol: 'Token',
      //   value: 'Value',
      //   loc: 'LOC'
      // },
      // [tokens.TX_REISSUE_ASSET]: {
      //   title: 'Reissue Asset',
      //   symbol: 'Token',
      //   value: 'Value',
      //   loc: 'LOC'
      // },
      // [tokens.TX_REQUIRE_TIME]: {
      //   title: 'Require TIME'
      // },
      //
      // // common
      // [tokens.TX_CLAIM_CONTRACT_OWNERSHIP]: {
      //   title: 'Claim Contract Ownership',
      //   address: 'Address'
      // },

      // other contracts
      // [contracts.TX_SET_OTHER_ADDRESS]: {
      //   title: 'Add Contract',
      //   address: 'Address',
      //   name: 'Name'
      // },
      // [contracts.TX_REMOVE_OTHER_ADDRESS]: {
      //   title: 'Remove Contract',
      //   address: 'Address',
      //   name: 'Name'
      // },
      // [contracts.TX_FORWARD]: {
      //   contract: 'Contract',
      //   address: 'Address',
      //
      //   [exchange.TX_SET_PRICES]: 'Set Prices',
      //   buyPrice: 'Buy Price',
      //   sellPrice: 'Sell Price'
      // }
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
      [erc20.TX_APPROVE]: {
        title: 'Approve TIME',
        account: 'Account',
        amount: 'Amount'
      },
      [erc20.TX_TRANSFER]: {
        title: 'Transfer TIME',
        recipient: 'Recipient',
        amount: 'Amount'
      }
    },
    ChronoBankAssetWithFeeProxy: {
      [erc20.TX_APPROVE]: {
        title: 'Approve LHT',
        account: 'Account',
        amount: 'Amount'
      },
      [erc20.TX_TRANSFER]: {
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
    },
    Rewards: {
      [rewards.TX_WITHDRAW_REWARD]: {
        title: 'Withdraw Reward',
        amount: 'Amount'
      },
      [rewards.TX_CLOSE_PERIOD]: {
        title: 'Close Rewards Period'
      }
    }
  },
  errors: {
    cantSentToYourself: 'Can\'t send tokens to yourself',
    notEnoughTokens: 'Not enough tokens',
    platformNotEnoughTokens: 'Platform doesn\'t have enough tokens to sell you',
    invalidCurrencyNumber: 'Should have maximum %{decimals} decimal places',
    invalidPositiveNumber: 'Should be positive integer',
    invalidURL: 'Should be valid URL',
    invalidEmail: 'Should be valid email address',
    invalidLength: 'Should have length more than or equal 3 symbols',
    invalidAddress: 'Should be valid Ethereum address',
    between: 'Should be between %{min} and %{max}',
    required: 'Required',
    greaterThanAllowed: 'Amount is greater than allowed',
    lowerThan: 'Should be lower than %{limit}',
    greaterOrEqualBuyPrice: 'Should be greater than or equal buy price',
    fileUploadingError: 'Could\'t upload file',
    alreadyExist: '%{what} already exists',
    transactionErrorTitle: 'Transaction Error',
    transactionErrorMessage: 'There are error while processing for %{item}. Error [%{code}]: %{message}'
  },
  forms: {
    selectFile: 'Please select a file',
    fileUploading: 'File uploading',
    mustBeCoSigned: 'This operation must be co-signed by other CBE key holders before it is executed.',
    correspondingFee: 'Corresponding fees will be deducted from this amount'
  },
  poll: {
    new: 'New Poll',
    create: 'Create Poll'
  },
  otherContract: {
    add: 'Add other contract'
  },
  errorCodes: {
    MODIFIER_STOPPED: 'Auth error',
    OK: 'OK',
    UNDEFINED: 'Undefined',

    LOC_NOT_FOUND: 'LOC not found',
    LOC_EXISTS: 'LOC exists',
    LOC_INACTIVE: 'LOC inactive',
    LOC_SHOULD_NO_BE_ACTIVE: 'LOC Should be active',
    LOC_INVALID_PARAMETER: 'LOC invalid parameters',
    LOC_INVALID_INVOCATION: 'LOC invalid invocation',
    LOC_ADD_CONTRACT: 'LOC add contract',
    LOC_SEND_ASSET: 'LOC send asset',
    LOC_REQUESTED_ISSUE_VALUE_EXCEEDED: 'LOC requested issue value exceed',
    LOC_REISSUING_ASSET_FAILED: 'LOC reissuing asset failed',
    LOC_REQUESTED_REVOKE_VALUE_EXCEEDED: 'LOC requested revoke value exceed',
    LOC_REVOKING_ASSET_FAILED: 'LOC revoking asset failed',

    USER_NOT_FOUND: 'User not found',
    USER_INVALID_PARAMETER: 'User: invalid request parameters',
    USER_ALREADY_CBE: 'User already CBE',
    USER_NOT_CBE: 'User is not CBE',
    USER_SAME_HASH: 'User has the same hash',
    USER_INVALID_REQURED: 'User: Invalid required',
    USER_INVALID_STATE: 'User: Invalid state',

    CROWDFUNDING_INVALID_INVOCATION: 'Crowdfunding: Invalid invocation',
    CROWDFUNDING_ADD_CONTRACT: 'Crowdfunding: add contract',
    CROWDFUNDING_NOT_ASSET_OWNER: 'Crowdfunding:User is not asset owner',

    PENDING_NOT_FOUND: 'Pending not found',
    PENDING_INVALID_INVOCATION: 'Pending Operation: Invalid invocation',
    PENDING_ADD_CONTRACT: 'Pending add contract',
    PENDING_DUPLICATE_TX: 'Duplicate transaction',
    PENDING_CANNOT_CONFIRM: 'Cannot confirm request',
    PENDING_PREVIOUSLY_CONFIRMED: 'Operation already confirmed',
    PENDING_NOT_ENOUGH_CONFIRMED: 'Operation not enough confirmed',

    STORAGE_INVALID_INVOCATION: 'Storage invalid invocation',

    EXCHANGE_INVALID_PARAMETER: 'Exchange: Invalid request parameter',
    EXCHANGE_INVALID_INVOCATION: 'Exchange: Invalid invocation',
    EXCHANGE_INVALID_FEE_PERCENT: 'Exchange: invalid fee percent',
    EXCHANGE_INVALID_PRICE: 'Exchange: invalid price',
    EXCHANGE_MAINTENANCE_MODE: 'Exchange: maintenance mode',
    EXCHANGE_TOO_HIGH_PRICE: 'Exchange: too high price',
    EXCHANGE_TOO_LOW_PRICE: 'Exchange: too low price',
    EXCHANGE_INSUFFICIENT_BALANCE: 'Exchange: insufficient balance',
    EXCHANGE_INSUFFICIENT_ETHER_SUPPLY: 'Exchange: insufficient ether supply',
    EXCHANGE_PAYMENT_FAILED: 'Exchange: payment failed',
    EXCHANGE_TRANSFER_FAILED: 'Exchange: transfer failed',
    EXCHANGE_FEE_TRANSFER_FAILED: 'Exchange: fee transfer failed',

    EXCHANGE_STOCK_NOT_FOUND: 'Exchange: stock not found',
    EXCHANGE_STOCK_INVALID_PARAMETER: 'Exchange: stock invalid parameter',
    EXCHANGE_STOCK_INVALID_INVOCATION: 'Exchange: stock invalid invocation',
    EXCHANGE_STOCK_ADD_CONTRACT: 'Exchange: stock add contract',
    EXCHANGE_STOCK_UNABLE_CREATE_EXCHANGE: 'Exchange: stock unable to create exchange',

    VOTE_INVALID_PARAMETER: 'Vote: invalid parameter',
    VOTE_INVALID_INVOCATION: 'Vote: invalid invocation',
    VOTE_ADD_CONTRACT: 'Vote: add contract',
    VOTE_LIMIT_EXCEEDED: 'Vote: limit exceeded',
    VOTE_POLL_LIMIT_REACHED: 'Vote: poll limit reached',
    VOTE_POLL_WRONG_STATUS: 'Vote: poll wrong status',
    VOTE_POLL_INACTIVE: 'Vote: poll inactive',
    VOTE_POLL_NO_SHARES: 'Vote: poll has\'t shares',
    VOTE_POLL_ALREADY_VOTED: 'Vote: poll already voted',
    VOTE_ACTIVE_POLL_LIMIT_REACHED: 'Vote: active poll limit reached',
    VOTE_UNABLE_TO_ACTIVATE_POLL: 'Vote: unable to activate poll',

    REWARD_NOT_FOUND: 'Reward: not found',
    REWARD_INVALID_PARAMETER: 'Reward: invalid request parameter',
    REWARD_INVALID_INVOCATION: 'Reward: invalid invocation',
    REWARD_INVALID_STATE: 'Reward: invalid state',
    REWARD_INVALID_PERIOD: 'Reward: invalid period',
    REWARD_NO_REWARDS_LEFT: 'Reward: no rewards left',
    REWARD_ASSET_TRANSFER_FAILED: 'Reward: asset transfer failed',
    REWARD_ALREADY_CALCULATED: 'Reward: already calculated',
    REWARD_CALCULATION_FAILED: 'Reward: calculation failed',
    REWARD_CANNOT_CLOSE_PERIOD: 'Reward: cannot close period',
    REWARD_ASSET_ALREADY_REGISTERED: 'Reward: asset already registered',

    CONTRACT_EXISTS: 'Contract already exists',
    CONTRACT_NOT_EXISTS: 'Contract not exists',

    TIMEHOLDER_ALREADY_ADDED: 'Timeholder already added',
    TIMEHOLDER_INVALID_INVOCATION: 'Timeholder: invalid invocation',
    TIMEHOLDER_INVALID_STATE: 'Timeholder: invalid state',
    TIMEHOLDER_TRANSFER_FAILED: 'Timeholder: transfer failed',
    TIMEHOLDER_WITHDRAWN_FAILED: 'Timeholder: withdrawn failed',
    TIMEHOLDER_DEPOSIT_FAILED: 'Timeholder: deposit failed',
    TIMEHOLDER_INSUFFICIENT_BALANCE: 'Timeholder: insufficient balance',

    ERCMANAGER_INVALID_INVOCATION: 'ERC20 Manager: invalid invocation',
    ERCMANAGER_INVALID_STATE: 'ERC20 Manager: invalid state',
    ERCMANAGER_TOKEN_SYMBOL_NOT_EXISTS: 'ERC20 Manager: token symbol not exists',
    ERCMANAGER_TOKEN_NOT_EXISTS: 'ERC20 Manager: token not exists',
    ERCMANAGER_TOKEN_SYMBOL_ALREADY_EXISTS: 'ERC20 Manager: token symbol already exists',
    ERCMANAGER_TOKEN_ALREADY_EXISTS: 'ERC20 Manager: token already exists',
    ERCMANAGER_TOKEN_UNCHANGED: 'ERC20 Manager: token unchanged',

    ASSETS_INVALID_INVOCATION: 'Assets: invalid invocation',
    ASSETS_EXISTS: 'Asset already exists',
    ASSETS_TOKEN_EXISTS: 'Assets: token already exists',
    ASSETS_CANNON_CLAIM_PLATFORM_OWNERSHIP: 'Assets: cannot claim platform ownership',
    ASSETS_WRONG_PLATFORM: 'Assets: wrong platform',
    ASSETS_NOT_A_PROXY: 'Assets: not a proxy',
    ASSETS_OWNER_ONLY: 'Assets: owner only',
    ASSETS_CANNOT_ADD_TO_REGISTRY: 'Assets: cannot add to registry',
  }
}
