/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { en as Login } from '@chronobank/login-ui/lang'
import components from 'components/lang'
import * as assetDonator from '@chronobank/core/dao/constants/AssetDonatorDAO'
import * as erc20 from '@chronobank/core/dao/constants/ERC20DAO'
import * as erc20Manager from '@chronobank/core/dao/constants/ERC20ManagerDAO'
import * as eth from '@chronobank/core/dao/constants/EthereumDAO'
import * as exchange from '@chronobank/core/dao/constants/ExchangeDAO'
import * as loc from '@chronobank/core/dao/constants/LOCManagerDAO'
import * as operations from '@chronobank/core/dao/constants/PendingManagerDAO'
import * as platformsManager from '@chronobank/core/dao/constants/PlatformsManagerDAO'
import * as pollInterface from '@chronobank/core/dao/constants/PollInterfaceDAO'
import * as rewards from '@chronobank/core/dao/constants/RewardsDAO'
import * as time from '@chronobank/core/dao/constants/AssetHolderDAO'
import * as user from '@chronobank/core/dao/constants/UserManagerDAO'
import layouts from 'layouts/lang'
import * as votingManager from '@chronobank/core/dao/constants/VotingManagerDAO'
import * as chronoBankAsset from '@chronobank/core/dao/constants/ChronoBankAssetDAO'

export default {
  copyright: 'Copyright © 2018 LaborX Pty Ltd. All Rights Reserved.',
  chronobankSite: 'Chronobank.io',
  qa: 'Q&A',
  contactUs: 'Contact Us',
  title: 'Eng',
  true: 'yes',
  false: 'no',
  tokenNotAvailable: 'Token Not Available',
  ...Login,
  ...components.en,
  layouts: layouts.en,
  global: {
    about: 'About',
    labourHours: 'Labour—Hours',
    laborx: 'LaborX',
    team: 'Team',
    faq: 'Q&A',
    blog: 'Blog',
  },
  nav: {
    project: 'ChronoMint',
    deposits: 'Deposits',
    deposit: 'Deposit',
    cbeDashboard: 'CBE Dashboard',
    locs: 'LOC Admin',
    lhOperations: 'LH Operations',
    operations: 'Operations',
    settings: 'Settings',
    wallet: 'Wallet',
    addWallet: 'Add wallet',
    exchange: 'Exchange',
    voting: 'Voting',
    newPoll: 'Create new poll',
    rewards: 'Bonuses',
    assets: 'My assets',
    profile: 'Profile',
    signOut: 'Sign out',
    search: 'Search...',
    actions: 'Actions',
    loadMore: 'Load More',
    markupDashboard: 'Dashboard',
    markupWallet: 'New Wallet',
    newRewards: 'New Bonuses',
    pageNotFound: 'Page not found',
    backToMain: 'Back to main page',
    twoFa: 'Enable 2FA',
    poll: 'Poll',
  },
  common: {
    name: 'Name',
    address: 'Address',
    ethAddress: 'Ethereum Address',
    of: 'of %{count}',
  },
  wallet: {
    modeAdvanced: 'Advanced',
    modeSimple: 'Basic',
    templateName: 'Template name',
    satPerByte: 'SAT / byte',
    gweiPerGas: 'GWEI 0 / gas',
    gasLimit: 'Gas limit',
    sendTokens: 'Send tokens',
    walletName: 'Wallet name',
    recipientAddress: 'Recipient address',
    selectTokenIcon: 'Please select icon file',
    multisignature: 'Multisignature',
    mainWallet: 'Main wallet',
    owners: 'owners',
    youHave: 'You have',
    multisignatureWallets: 'Multisignature wallets',
    createMultisignatureWallet: 'Create multisignature wallet',
    changeMultisignatureWallet: 'Change multisignature wallet',
    switchToMultisignatureWallet: 'Switch to multisignature wallet',
    switchToMainWallet: 'Switch to main wallet',
    pendingTransfers: 'Pending transfers',
    to: 'To',
    transaction: 'Transaction',
    actions: 'Actions',
    value: 'Value',
    revoke: 'Revoke',
    sign: 'Sign',
    enterCode: 'Enter Code',
  },
  exchange: {
    tokens: 'Exchange tokens',
    rates: 'Exchange rates',
    exchange: 'Exchange',
    buyPrice: 'Buy price',
    sellPrice: 'Sell price',
    limits: 'Exchange limits',
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
    modify: 'Modify',
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
    daysLeft: 'days left',
    daysLeft_1: 'day left',
    updateStatus: 'Update Status',
    addedOn: 'Added on %{date}',
    forms: {
      amountToBeS: 'Amount to be %{action}',
      allowedToBeS: 'Allowed to be %{action} on behalf of %{name}: %{limit} %{currency}',
      actions: {
        issued: 'issued',
        redeemed: 'redeemed',
      },
    },
    status: {
      maintenance: 'Maintenance',
      active: 'Active',
      suspended: 'Suspended',
      bankrupt: 'Bankrupt',
      inactive: 'Inactive',
    },
    notice: {
      added: 'Added',
      removed: 'Removed',
      updated: 'Updated',
      statusUpdated: 'Status updated',
      issued: 'Issued',
      revoked: 'Revoked',
    },
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
      requiredSigns: 'The amount of signatures required should not exceed CBE count.',
    },
  },
  settings: {
    user: {
      title: 'User',
      cbeAddresses: {
        title: 'CBE Addresses',
      },
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
          addressInUse: 'This address is already in use',
          symbolInUse: 'This symbol is already in use',
          invalidSymbol: 'Symbol can only contain from 2 to 4 A-Z letters',
        },
      },
    },
  },
  notices: require('./en-notices'),
  tx: {
    transactions: 'Transactions',
    blockNumber: 'Block Number',
    noTransactions: 'No transactions',
    confirm: 'Confirm Transaction',
    fee: 'Fee',
    balanceAfter: '%{symbol} balance after',
    feeLeft: 'Transaction fee left',
    notEnough: 'Not enough %{symbol}',
    TokenManagementInterface: {
      createAssetWithoutFee: {
        title: 'Confirm create token',
      },
      createAssetWithFee: {
        title: 'Confirm create token',
      },
    },
    ChronoBankPlatform: {
      reissueAsset: {
        title: 'Confirm reissue tokens',
      },
      revokeAsset: {
        title: 'Confirm revoke tokens',
      },
      addAssetPartOwner: {
        title: 'Confirm add manager',
      },
      removeAssetPartOwner: {
        title: 'Confirm remove manager',
      },
    },
    UserManager: {
      [user.TX_ADD_CBE]: {
        title: 'Add CBE',
        name: 'Name',
        address: 'Address',
      },
      [user.TX_REVOKE_CBE]: {
        title: 'Revoke CBE',
        name: 'Name',
        address: 'Address',
      },
      [user.TX_SET_REQUIRED_SIGNS]: {
        title: 'Set Required Signatures',
        _required: 'Quantity',
      },
      [user.TX_SET_OWN_HASH]: {
        title: 'Update profile',
        name: 'Name',
        email: 'E-mail',
        company: 'Company',
        tokens: 'Tokens',
      },
      [user.TX_SET_MEMBER_HASH]: {
        title: 'Update profile',
        address: 'Address',
        name: 'Name',
        email: 'Email',
        company: 'Company',
      },
      errors: {
        saveInIPFSError: 'Save data in the IPFS ended with an error, please try again. It`s free.',
        repeatButtonName: 'repeat save in IPFS',
      },
    },
    Ethereum: {
      [eth.TX_TRANSFER]: {
        title: 'Transfer ETH',
        to: 'Address to',
      },
    },
    /* eslint-disable global-require */
    General: require('./en-tx-general'),
    Bitcoin: require('./en-tx-bitcoin'),
    Nem: require('./en-tx-nem'),
    Waves: require('./en-tx-waves'),
    /* eslint-enable global-require */
    ContractsManager: {},
    ChronoBankAssetProxy: {
      [erc20.TX_APPROVE]: {
        title: 'Approve TIME',
        account: 'Account',
        amount: 'Amount',
      },
      [erc20.TX_TRANSFER]: {
        title: 'Transfer TIME',
        recipient: 'Recipient',
        amount: 'Amount',
      },
    },
    ChronoBankAssetWithFeeProxy: {
      [erc20.TX_APPROVE]: {
        title: 'Approve LHT',
        account: 'Account',
        amount: 'Amount',
      },
      [erc20.TX_TRANSFER]: {
        title: 'Transfer LHT',
        recipient: 'Recipient',
        amount: 'Amount',
      },
    },
    PendingManager: {
      [operations.TX_CONFIRM]: {
        title: 'Confirm Operation',
      },
      [operations.TX_REVOKE]: {
        title: 'Revoke Operation',
      },
    },
    TimeHolder: {
      [time.TX_DEPOSIT]: {
        title: 'Deposit TIME',
        amount: 'Amount',
      },
      [time.TX_WITHDRAW_SHARES]: {
        title: 'Withdraw TIME',
        amount: 'Amount',
      },
    },
    Rewards: {
      [rewards.TX_WITHDRAW_REWARD]: {
        title: 'Withdraw Bonus',
        amount: 'Amount',
      },
      [rewards.TX_CLOSE_PERIOD]: {
        title: 'Close Bonuses Period',
      },
    },
    AssetDonator: {
      [assetDonator.TX_REQUIRE_TIME]: {
        title: 'Require TIME',
        donation: 'Donation',
      },
    },
    PlatformsManager: {
      [platformsManager.TX_CREATE_PLATFORM]: {
        title: 'Confirm create platform',
      },
      [platformsManager.TX_ATTACH_PLATFORM]: {
        title: 'Confirm attach platform',
      },
      [platformsManager.TX_DETACH_PLATFORM]: {
        title: 'Confirm detach platform',
      },
    },
    LOCManager: {
      [loc.standardFuncs.SET_STATUS]: {
        title: 'Set Status',
      },
      [loc.standardFuncs.ADD_LOC]: {
        title: 'Add LOC',
        name: 'Name',
        website: 'Website',
        issueLimit: 'Issue Limit',
        publishedHash: 'Contract',
        expDate: 'Expiration Date',
        currency: 'Currency',
      },
      [loc.standardFuncs.SET_LOC]: {
        title: 'Update LOC',
        name: 'Name',
        website: 'Website',
        issueLimit: 'Issue Limit',
        publishedHash: 'Contract',
        expDate: 'Expiration Date',
      },
      [loc.multisigFuncs.REMOVE_LOC]: {
        title: 'Remove LOC',
        name: 'Name',
      },
      [loc.multisigFuncs.REISSUE_ASSET]: {
        title: 'Issue asset',
        amount: 'Amount',
        name: 'Name',
      },
      [loc.multisigFuncs.REVOKE_ASSET]: {
        title: 'Revoke Asset',
        amount: 'Amount',
        name: 'Name',
      },
      [loc.multisigFuncs.UPDATE_LOC_STATUS]: {
        title: 'Update LOC status',
        name: 'Name',
        status: 'Status',
      },
      [loc.multisigFuncs.SEND_ASSET]: {
        title: 'Send Asset',
      },
    },
    ERC20Manager: {
      [erc20Manager.TX_MODIFY_TOKEN]: {
        title: 'Modify Token',
      },
      [erc20Manager.TX_REMOVE_TOKEN]: {
        title: 'Remove Token',
      },
      [erc20Manager.TX_ADD_TOKEN]: {
        title: 'Add Token',
      },
    },
    ERC20Interface: {
      [erc20.TX_APPROVE]: {
        title: 'Approve to transfer your tokens',
        account: 'Account',
        amount: 'Amount',
      },
      [erc20.TX_TRANSFER]: {
        title: 'Transfer tokens',
        account: 'Account',
        amount: 'Amount',
        to: 'Address to',
      },
    },
    ExchangeManager: {
      createExchange: {
        title: 'Create an exchange',
      },
    },
    Exchange: {
      [exchange.TX_BUY]: {
        title: 'Confirm buy tokens for ETH',
      },
      [exchange.TX_SELL]: {
        title: 'Confirm sell tokens for ETH',
      },
      [exchange.TX_WITHDRAW_TOKENS]: {
        title: 'Confirm withdraw tokens',
      },
      [exchange.TX_WITHDRAW_ETH]: {
        title: 'Confirm withdraw ETH',
      },
    },
    Wallet: {
      transfer: {
        title: 'Transfer',
        value: 'Value',
        to: 'To',
        symbol: 'Symbol',
      },
      confirm: {
        title: 'Confirm tx',
        value: 'Value',
        to: 'To',
        symbol: 'Symbol',
      },
      revoke: {
        title: 'Revoke tx',
        value: 'Value',
        to: 'To',
        symbol: 'Symbol',
      },
      addOwner: {
        title: 'Add owner',
        owner: 'New Owner',
      },
      removeOwner: {
        title: 'Remove owner',
        owner: 'Owner',
      },
      kill: {
        title: 'Kill wallet',
        to: 'Transfer tokens to',
      },
      changeRequirement: {
        title: 'Change required signatures',
        requiredSignatures: 'New value',
      },
    },
    PollInterface: {
      [pollInterface.TX_ACTIVATE_POLL]: {
        title: 'Activate poll',
      },
      [pollInterface.TX_REMOVE_POLL]: {
        title: 'Remove Poll',
      },
      [pollInterface.TX_END_POLL]: {
        title: 'End Poll',
      },
      [pollInterface.TX_VOTE]: {
        title: 'Vote',
      },
    },
    VotingManager: {
      [votingManager.TX_CREATE_POLL]: {
        title: 'Create Poll',
      },
    },
    ChronoBankAsset: {
      [chronoBankAsset.TX_PAUSE]: {
        title: 'Block asset',
      },
      [chronoBankAsset.TX_UNPAUSE]: {
        title: 'Unblock asset',
      },
      [chronoBankAsset.TX_RESTRICT]: {
        title: 'Add user to blacklist',
      },
      [chronoBankAsset.TX_UNRESTRICT]: {
        title: 'Remove user from blacklist',
      },
    },
    WalletsManager: {
      'createWallet': {
        title: 'Create multisignature wallet',
        owners: 'Owners',
        requiredSignatures: 'Required signatures',
        releaseTime: 'Release time',
        isTimeLocked: 'Is timeLocked',
      },
      'create2FAWallet': {
        title: 'Create 2FA wallet',
      },
    },
  },
  errors: {
    required: 'Required',
    invalidPositiveInt: 'Should be a positive integer',
    invalidPositiveNumber: 'Should be a positive number',
    invalidPositiveNumberOrZero: 'Should be a positive number or zero',
    invalidURL: 'Should be valid URL',
    invalidEmail: 'Should be valid email address',
    invalidLength: 'Should have length more than or equal 3 symbols',
    invalidMaxLength: 'Should have length less than or equal 32 symbols',
    invalidAddress: 'Should be valid %{blockchain} address',
    validIpfsFileList: 'Should be valid file list',
    between: 'Should be between %{min} and %{max}',
    lowerThan: 'Should be lower than %{limit}',
    lowerThanOrEqual: 'Should be lower or equal than %{limit}',
    moreThan: 'Should be more than %{limit}',
    moreThanOrEqual: 'Should be more or equal than %{limit}',
    countMoreThan: 'Count should be more than %{limit}',
    countMoreThanOrEqual: 'Count should be more or equal than %{limit}',
    invalidLatinString: 'String must have only Latin characters (A-z)',
    mustBeUnique: 'Value must be unique',
    invalidConfirm2FACode: 'Should be a 6-digit code',
    cantSentToYourself: 'Can\'t send tokens to yourself',
    notTokens: 'The wallet has insufficient funds',
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
        haveToBeString: 'Have to be string',
      },
    },
  },
  forms: {
    selectFile: 'Please select a file',
    fileUploading: 'File uploading',
    mustBeCoSigned: 'This operation must be co-signed by other CBE key holders before it is executed.',
    correspondingFee: 'Corresponding fees will be deducted from this amount',
  },
  dialogs: {
    copyAddress: {
      title: 'Copy address',
      controlTitle: 'Address',
      description: 'Press CTRL + C or ⌘ + C to copy address to clipboard',
    },
    copyPrivateKey: {
      title: 'Copy private key',
      controlTitle: 'Private key',
      description: 'Press CTRL + C or ⌘ + C to copy private key to clipboard',
    },
  },
  poll: {
    new: 'New Poll',
    create: 'Create Poll',
  },
  otherContract: {
    add: 'Add other contract',
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

    REWARD_NOT_FOUND: 'Bonus: not found',
    REWARD_INVALID_PARAMETER: 'Bonus: invalid request parameter',
    REWARD_INVALID_INVOCATION: 'Bonus: invalid invocation',
    REWARD_INVALID_STATE: 'Bonuses: invalid state',
    REWARD_INVALID_PERIOD: 'Bonuses: invalid period',
    REWARD_NO_REWARDS_LEFT: 'Bonuses: no bonuses left',
    REWARD_ASSET_TRANSFER_FAILED: 'Bonus: asset transfer failed',
    REWARD_ALREADY_CALCULATED: 'Bonus: already calculated',
    REWARD_CALCULATION_FAILED: 'Bonus: calculation failed',
    REWARD_CANNOT_CLOSE_PERIOD: 'Bonus: cannot close period',
    REWARD_ASSET_ALREADY_REGISTERED: 'Bonus: asset already registered',

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
  fileSelect: {
    errors: {
      // TODO @dkchv: add errors
    },
    attachNew: 'Attach new',
    selectFile: 'Select File',
    filesLimit: '%{files} of %{limit}',
  },
  networkStatus: {
    online: 'Online',
    offline: 'Offline',
    syncing: 'Syncing',
    synced: 'Synced',
    unknown: 'Fetching status...',
  },
  materialUi: {
    DatePicker: {
      cancelLabel: 'Cancel',
      okLabel: 'OK',
    },
  },
  components: {
    ...components.components,
    TransactionsTable: {
      latestTransactions: 'Latest transactions',
      time: 'Time',
      block: 'Block',
      type: 'Type',
      hash: 'Hash',
      from: 'From',
      to: 'To',
      value: 'Value',
    },
    DepositTokens: {
      depositTime: 'Deposit Time',
      withdraw: 'Withdraw',
      depositAccount: 'Deposit account',
      amount: 'Amount, %{symbol}',
      slow: 'Slow transaction',
      fast: 'Fast',
      yourSymbolBalance: 'Your %{symbol} balance',
      yourDeposit: 'Your deposit',
      holderAllowance: 'holder allowance',
      transactionFee: 'Transaction fee',
      requestTime: 'Request TIME',
      multiplier: ', it is %{multiplier}x of average fee.',
      enterAmount: 'Enter amount greater than 0',
      note: 'Please note.',
      noteText: `In order deposit you'll need to pay two around the same fees.  We're informing you about applicable fees on each step. You also will be able to revoke operation, but not the processed fee.`,
      noteTwo: `Your deposit request has been processed. Please set a fee to place funds in your deposit or revoke the operation.`,
      noteEth: `Your Ethereum account has insufficient funds. Please add Ethereum on your account in order to withdraw.`,
      noteBalance: `Your TIME account has insufficient funds. Please add TIME on your account in order to withdraw.`,
      buyTime: 'Buy Time',
      receiveEth: 'Receive Eth',
      gasPrice: 'Gas price',
      firstStep: '1. Deposit Amount',
      secondStep: '2. Finish Deposit',
      proceed: 'PROCEED',
      revoke: 'REVOKE',
      finish: 'FINISH',
      depositAmount: 'Amount on deposit',
      balanceAmount: 'Your balance',
      changeAmount: 'Change',
    },
    ReceiveTokenModal: {
      receive: 'Receive',
      important: 'Important!',
      warningText1: `Make sure you're receiving `,
      warningText2: ` to the address provided below. Otherwise it can make the funds loss.`,
      receivingTitle: 'Your receiving %{symbol} address',
      qrTitle: 'Your QR code for the %{symbol} address',
      buyTitle: 'Also, you can buy %{symbol} in exchanges',
    },
    RewardsPeriod: {
      rewardsPeriodIndex: 'Bonus period #%{index}',
      ongoing: 'Ongoing',
      closed: 'Closed',
      startDate: 'Start date',
      inDaysDays: 'in %{days} days',
      endDate: 'End date',
      totalTimeTokensDeposited: 'Total TIME tokens deposited',
      percentOfTotalCount: '%{percent}% of total count',
      uniqueShareholders: 'Unique shareholders',
      yourTimeTokensEligible: 'Your TIME tokens eligible for bonuses in the period',
      percentOfTotalDepositedAmount: '%{percent}% of total deposited amount',
      dividendsAccumulatedForPeriod: 'Dividends accumulated for period',
      yourApproximateRevenueForPeriod: 'Your approximate revenue for period',
    },
    locs: {
      PageTitle: {
        labourOfferingCompanies: 'Labour Offering Companies',
      },
    },
    operations: {
      Operations: {
        settings: 'Settings',
        description: 'Description',
        signatures: 'Signatures',
        actions: 'Actions',
      },
    },
    settings: {
      Tokens: {
        tokens: 'Tokens',
        name: 'Name',
        smartContractAddress: 'Smart Contract Address',
        actions: 'Actions',
        addToken: 'Add Token',
      },
      CBEAddresses: {
        cbeAddresses: 'CBE Addresses',
        addCbe: 'Add CBE',
        name: 'Name',
        smartContractAddress: 'Smart Contract Address',
        actions: 'Actions',
        remove: 'Remove',
      },
    },
    dialogs: {
      OperationsSettingsDialog: {
        operationsSettings: 'Operations Settings',
        cancel: 'Cancel',
        save: 'Save',
      },
      CBEAddressDialog: {
        addCbeAddress: 'Add CBE Address',
        cancel: 'Cancel',
        addAddress: 'Add Address',
      },
      AddTokenDialog: {
        tokenContractAddress: 'Token contract address',
        tokenName: 'Token name',
        tokenSymbol: 'Token symbol',
        decimalsPlacesOfSmallestUnit: 'Decimals places of smallest unit',
        tokenNameHead: 'Token name',
        tokenAddressHead: 'Token address',
        projectURL: 'Project URL',
        save: 'Save',
        cancel: 'Cancel',
      },
      VoteDialog: {
        chooseOption: 'Choose option',
        ongoing: 'Ongoing',
        timeHoldersAlreadyVoted: 'percent of TIME received',
        published: 'Published',
        endDate: 'End date',
        requiredVotes: 'Required TIME',
        receivedVotes: 'Received TIME',
        variants: 'Variants',
        documents: 'Documents',
        no: 'No',
        daysLeft: 'days left',
        daysLeft_1: 'day left',
        vote: 'Vote',
      },
    },
  },
  topButtons: {
    addDeposit: 'Add deposit',
    addWallet: 'Add a wallet',
    addPoll: 'Add a Poll',
    publish: 'Publish',
    endPoll: 'End poll',
    addToken: 'Add a token',
    voteHistory: 'Changes History',
  },
}
