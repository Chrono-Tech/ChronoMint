import * as user from 'dao/UserManagerDAO'
import * as voting from 'dao/VotingDAO'
import * as erc20 from 'dao/ERC20DAO'
import * as eth from 'dao/EthereumDAO'
import * as erc20Manager from 'dao/ERC20ManagerDAO'
import * as operations from 'dao/PendingManagerDAO'
import * as time from 'dao/TIMEHolderDAO'
import * as rewards from 'dao/RewardsDAO'
import * as loc from 'dao/LOCManagerDAO'
import * as assetDonator from 'dao/AssetDonatorDAO'
import * as exchange from 'dao/ExchangeDAO'

export default {
  title: 'Eng',
  global: {
    about: 'About',
    labourHours: 'Labour—Hours',
    laborx: 'LaborX',
    team: 'Team',
    faq: 'Q&A',
    blog: 'Blog'
  },
  nav: {
    project: 'ChronoMint',
    dashboard: 'Dashboard (soon)',
    cbeDashboard: 'CBE Dashboard',
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
    loadMore: 'Load More',
    markupDashboard: 'Dashboard',
    markupWallet: 'New Wallet',
    newRewards: 'New Rewards',
    pageNotFound: 'Page not found',
    backToMain: 'Back to main page'
  },
  common: {
    name: 'Name',
    address: 'Address',
    ethAddress: 'Ethereum Address'
  },
  wallet: {
    sendTokens: 'Send tokens',
    recipientAddress: 'Recipient address',
    selectTokenIcon: 'Please select icon file',
    multisignature: 'Multisignature',
    mainWallet: 'Main wallet',
    owners: 'owners',
    youHave: 'You have',
    multisignatureWallets: 'Multisignature wallets',
    switchMultisignatureWallet: 'Switch multisignature wallet',
    switchToMainWallet: 'Switch to main wallet',
    pendingTransfers: 'Pending transfers (demo)',
    to: 'To',
    value: 'Value',
    revoke: 'REVOKE',
    sign: 'SIGN',
    walletSelectDialog: {
      multisignatureWallets: 'Multisignature wallets',
      addWallet: 'Add wallet',
      yourWallets: 'Your wallets',
      youHaveNoWallets: 'You have no wallets',
      howToAddMultisignatureWallet: "How to add mulisignature wallet? It's easy!",
      toCreateAMultisigWallet: 'To create a multisig wallet',
      clickPlusButtonAtTheTop: 'Click plus button at the top',
      selectOwnersAtLeastTwo: 'Select owners, at least two',
      selectRequiredNumberOfSignaturesFromOwners: 'Select required number of signatures from owners',
      owners: 'owners'
    },
    walletAddEditDialog: {
      newWallet: 'New wallet',
      editWallet: 'Edit wallet',
      walletName: 'Wallet name',
      dayLimit: 'Day limit',
      requiredSignatures: 'Required signatures',
      walletOwners: 'Wallet owners',
      addOwner: 'Add owner',
      addWallet: 'Add wallet',
      save: 'Save',
      ownerAddress: 'Owner address'
    }
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
    confirm: 'Confirm',
    save: 'Save',
    view: 'View',
    error: 'Error',
    pending: 'Pending',
    failed: 'Failed',
    remove: 'Remove',
    modify: 'Modify'
  },
  locs: {
    entries: '%{number} entries total',
    sendToExchange: 'Send to exchange',
    recent: 'Recent LOCs',
    insuranceFee: 'Insurance fee',
    allowedToBeIssued: 'Allowed to be issued',
    expirationDate: 'Expiration Date',
    issuanceParameters: 'Issuance parameters',
    sendLHToExchange: 'Send LHT to Exchange',
    uploadedFile: 'Uploaded File',
    issueLHT: 'Issue LHT',
    issueS: 'Issue %{asset}',
    issueLimit: 'Issue Limit',
    issued: 'Issued',
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
    addedOn: 'Added on %{date}',
    forms: {
      amountToBeS: 'Amount to be %{action}',
      allowedToBeS: 'Allowed to be %{action} on behalf of %{name}: %{limit} %{currency}',
      actions: {
        issued: 'issued',
        redeemed: 'redeemed'
      }
    },
    status: {
      maintenance: 'Maintenance',
      active: 'Active',
      suspended: 'Suspended',
      bankrupt: 'Bankrupt',
      inactive: 'Inactive'
    },
    notice: {
      added: 'Added',
      removed: 'Removed',
      updated: 'Updated',
      statusUpdated: 'Status updated',
      issued: 'Issued',
      revoked: 'Revoked'
    }
  },
  operations: {
    completed: 'Completed operations',
    settings: 'Operations settings',
    desc: 'Description',
    signs: 'Signatures remained',
    sign: 'Sign',
    revoke: 'Revoke',
    emptyPendingList: 'No pending operations.',
    emptyCompletedList: 'No completed operations.',
    adminCount: 'Number of CBE',
    requiredSigns: 'Required signatures',
    errors: {
      // TODO @bshevchenko: move this duplicate error to the common tx errors list
      duplicate: 'This transaction already added to the list of operations needed multi-signatures.',
      requiredSigns: 'The amount of signatures required should not exceed CBE count.'
    }
  },
  settings: {
    user: {
      title: 'User',
      cbeAddresses: {
        title: 'CBE Addresses'
      }
    },
    erc20: {
      title: 'ERC20 tokens',
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
  notices: require('./en-notices'),
  tx: {
    transactions: 'Transactions',
    blockNumber: 'Block Number',
    noTransactions: 'No transactions',
    confirm: 'Confirm Transaction',
    fee: 'Fee',
    balanceAfter: 'Balance after',
    feeLeft: 'Transaction fee left',
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
        title: 'Update profile',
        name: 'Name',
        email: 'E-mail',
        company: 'Company',
        tokens: 'Tokens'
      },
      [user.TX_SET_MEMBER_HASH]: {
        title: 'Update profile',
        address: 'Address',
        name: 'Name',
        email: 'Email',
        company: 'Company'
      }
    },
    Ethereum: {
      [eth.TX_TRANSFER]: {
        title: 'Transfer ETH'
      }
    },
    ContractsManager: {},
    Vote: {
      [voting.TX_ADMIN_END_POLL]: {
        title: 'End Poll',
        id: 'Id'
      },
      [voting.TX_ACTIVATE_POLL]: {
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
    },
    AssetDonator: {
      [assetDonator.TX_REQUIRE_TIME]: {
        title: 'Require TIME'
      }
    },
    LOCManager: {
      [loc.standardFuncs.ADD_LOC]: {
        title: 'Add LOC',
        name: 'Name',
        website: 'Website',
        issueLimit: 'Issue Limit',
        publishedHash: 'Contract',
        expDate: 'Expiration Date',
        currency: 'Currency'
      },
      [loc.standardFuncs.SET_LOC]: {
        title: 'Update LOC',
        name: 'Name',
        website: 'Website',
        issueLimit: 'Issue Limit',
        publishedHash: 'Contract',
        expDate: 'Expiration Date'
      },
      [loc.multisigFuncs.REMOVE_LOC]: {
        title: 'Remove LOC',
        name: 'Name'
      },
      [loc.multisigFuncs.REISSUE_ASSET]: {
        title: 'Issue asset',
        amount: 'Amount',
        name: 'Name'
      },
      [loc.multisigFuncs.REVOKE_ASSET]: {
        title: 'Revoke Asset',
        amount: 'Amount',
        name: 'Name'
      },
      [loc.multisigFuncs.UPDATE_LOC_STATUS]: {
        title: 'Update LOC status',
        name: 'Name',
        status: 'Status'
      },
      [loc.multisigFuncs.SEND_ASSET]: {
        title: 'Send Asset'
      }
    },
    ERC20Manager: {
      [erc20Manager.TX_MODIFY_TOKEN]: {
        title: 'Modify Token'
      },
      [erc20Manager.TX_REMOVE_TOKEN]: {
        title: 'Remove Token'
      },
      [erc20Manager.TX_ADD_TOKEN]: {
        title: 'Add Token'
      }
    },
    ERC20Interface: {
      [erc20.TX_APPROVE]: {
        title: 'Approve to transfer your tokens',
        account: 'Account',
        amount: 'Amount'
      },
      [erc20.TX_TRANSFER]: {
        title: 'Transfer tokens',
        account: 'Account',
        amount: 'Amount'
      }
    },
    Exchange: {
      [exchange.TX_BUY]: {
        title: 'Buy LHT for ETH'
      },
      [exchange.TX_SELL]: {
        title: 'Sell LHT for ETH'
      }
    }
  },
  errors: {
    required: 'Required',
    invalidPositiveInt: 'Should be positive integer',
    invalidPositiveNumber: 'Should be positive number',
    invalidPositiveNumberOrZero: 'Should be positive number or zero',
    invalidURL: 'Should be valid URL',
    invalidEmail: 'Should be valid email address',
    invalidLength: 'Should have length more than or equal 3 symbols', // TODO @bshevchenko: get rid of this odd error
    invalidAddress: 'Should be valid Ethereum address',
    between: 'Should be between %{min} and %{max}',
    lowerThan: 'Should be lower than %{limit}',
    limitDepositOnMainnet: 'Deposit TIME is temporarily limited to 1 TIME on the main network',

    // TODO @bshevchenko: errors domain only for common cases. Move out entries below to the appropriate domains
    cantSentToYourself: 'Can\'t send tokens to yourself',
    notEnoughTokens: 'Not enough tokens',
    platformNotEnoughTokens: 'Platform doesn\'t have enough tokens to sell you',
    invalidCurrencyNumber: 'Should have maximum %{decimals} decimal places',
    greaterThanAllowed: 'Amount is greater than allowed',

    greaterOrEqualBuyPrice: 'Should be greater than or equal buy price',
    fileUploadingError: 'Could\'t upload file',
    alreadyExist: '%{what} already exists',
    transactionErrorTitle: 'Transaction Error',
    transactionErrorMessage: 'There are error while processing for %{item}. Error [%{code}]: %{message}',
    wallet: {
      walletName: {
        haveToBeString: 'Have to be string'
      },
      dayLimit: {
        haveToBeNumber: 'Have to be number'
      },
      requiredSignatures: {
        haveToBeMoreThanTwoOrEqual: 'Have to be more than to or equal'
      },
      ownersCount: {
        haveToBeMoreThanTwoOrEqual: 'Have to be more than to or equal'
      }
    }
  },
  forms: {
    selectFile: 'Please select a file',
    fileUploading: 'File uploading',
    mustBeCoSigned: 'This operation must be co-signed by other CBE key holders before it is executed.',
    correspondingFee: 'Corresponding fees will be deducted from this amount'
  },
  dialogs: {
    copyAddress: {
      title: 'Copy address',
      controlTitle: 'Address',
      description: 'Press CTRL + C or ⌘ + C to copy address to clipboard'
    }
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

    FRONTEND_UNKNOWN: 'Unknown transaction error.',
    FRONTEND_OUT_OF_GAS: 'Transaction is out of gas.',
    FRONTEND_WEB3_FILTER_FAILED: 'Unknown transaction result due to web3 filter error.',
    FRONTEND_RESULT_FALSE: 'Transaction failed with false result.',
    FRONTEND_RESULT_TRUE: 'Transaction failed with true result.',
    FRONTEND_INVALID_RESULT: 'Transaction invalid result.',

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
    USER_INVALID_REQURED: 'User: Invalid required', // TODO @bshevchenko: TYPO!
    USER_INVALID_STATE: 'User: Invalid state',

    CROWDFUNDING_INVALID_INVOCATION: 'Crowdfunding: Invalid invocation',
    CROWDFUNDING_ADD_CONTRACT: 'Crowdfunding: add contract',
    CROWDFUNDING_NOT_ASSET_OWNER: 'Crowdfunding: User is not asset owner',

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
  },
  layouts: {
    partials: {
      FooterPartial: {
        download: 'Download',
        subscribe: 'Subscribe',
        enterEmailForNews: 'Enter email for news',
        newsletter: 'Newsletter (coming soon)',
        contactUs: 'Contact us',
        technicalSupport: 'Technical support',
        generalInquiries: 'General inquiries',
        menu: 'Menu'
      },
      WalletContent: {
        youCanUseTheMultisignatureWallets: 'You can use the multisignature wallets',
        walletsAreSmartContractsWhichManageAssets: 'Wallets are smart contracts which manage assets and can be owned by multiple accounts. Unlike accounts, contract wallets are controlled by code, which means that it is possible to customize their behavior. The most common use-case are multi-signature wallets, that allow for transaction logging, withdrawal limits, and rule-sets for signatures required.'
      }
    }
  },
  components: {
    dashboard: {
      TransactionsTable: {
        latestTransactions: 'Latest transactions',
        time: 'Time',
        block: 'Block',
        type: 'Type',
        hash: 'Hash',
        from: 'From',
        to: 'To',
        value: 'Value'
      }
    }
  }
}
