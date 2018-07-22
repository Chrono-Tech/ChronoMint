/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  bccProvider,
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_LITECOIN,
  btcProvider,
  btgProvider,
  ltcProvider,
} from '@chronobank/login/network/BitcoinProvider'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import { change, formValueSelector } from 'redux-form/immutable'
import { nemProvider } from '@chronobank/login/network/NemProvider'
import { wavesProvider } from '@chronobank/login/network/WavesProvider'
import { history } from '@chronobank/core-dependencies/configureStore'
import { push } from '@chronobank/core-dependencies/router'
import { EVENT_APPROVAL_TRANSFER, EVENT_NEW_TRANSFER, EVENT_UPDATE_BALANCE, EVENT_UPDATE_TRANSACTION } from '../../dao/AbstractTokenDAO'
import { getDeriveWalletsAddresses, getMultisigWallets } from '../wallet/selectors'
import ethereumDAO, { BLOCKCHAIN_ETHEREUM } from '../../dao/EthereumDAO'
import Amount from '../../models/Amount'
import ApprovalNoticeModel from '../../models/notices/ApprovalNoticeModel'
import TransferNoticeModel from '../../models/notices/TransferNoticeModel'
import BalanceModel from '../../models/tokens/BalanceModel'
import TokenModel from '../../models/tokens/TokenModel'
import validator from '../../models/validator'
import AddressModel from '../../models/wallet/AddressModel'
import AllowanceModel from '../../models/wallet/AllowanceModel'
import { TXS_PER_PAGE } from '../../models/wallet/TransactionsCollection'
import { addMarketToken } from '../market/actions'
import { notify, notifyError } from '../notifier/actions'
import { DUCK_SESSION } from '../session/actions'
import { DUCK_TOKENS, subscribeOnTokens } from '../tokens/actions'
import tokenService from '../../services/TokenService'
import type TxModel from '../../models/TxModel'
import { TX_DEPOSIT, TX_WITHDRAW_SHARES } from '../../dao/AssetHolderDAO'
import { TX_APPROVE } from '../../dao/ERC20DAO'
import OwnerCollection from '../../models/wallet/OwnerCollection'
import OwnerModel from '../../models/wallet/OwnerModel'
import { DUCK_MULTISIG_WALLET, MULTISIG_BALANCE, MULTISIG_FETCHED } from '../multisigWallet/actions'
import DerivedWalletModel from '../../models/wallet/DerivedWalletModel'
import AddressesCollection from '../../models/wallet/AddressesCollection'
import MainWalletModel from '../../models/wallet/MainWalletModel'
import { BLOCKCHAIN_NEM } from '../../dao/NemDAO'
import { BLOCKCHAIN_WAVES } from '../../dao/WavesDAO'
import TxExecModel from '../../models/TxExecModel'
import { sendNewTx } from '../../refactor/redux/transactions/actions'
import WalletModel from '../../models/wallet/WalletModel'
import { daoByType } from '../../refactor/redux/daos/selectors'
import { WALLETS_SET_IS_TIME_REQUIRED, WALLETS_UPDATE_WALLET } from '../wallets/actions'
import TxHistoryModel from '../../models/wallet/TxHistoryModel'
import { getMainAddresses, getMainEthWallet, getWallet } from '../wallets/selectors/models'
import { getAccount } from '../session/selectors/models'
import AllowanceCollection from '../../refactor/models/AllowanceCollection'

export const DUCK_MAIN_WALLET = 'mainWallet'
export const FORM_ADD_NEW_WALLET = 'FormAddNewWallet'

// TODO @ipavlenko: Odd code, remove WALLET_BALANCE
export const WALLET_BALANCE = 'mainWallet/BALANCE'
export const WALLET_ALLOWANCE = 'mainWallet/ALLOWANCE'
export const WALLET_ADDRESS = 'mainWallet/WALLET_ADDRESS'
export const WALLET_CURRENT_BLOCK_HEIGHT = 'mainWallet/WALLET_CURRENT_BLOCK_HEIGHT'
export const WALLET_TRANSACTIONS_FETCH = 'mainWallet/TRANSACTIONS_FETCH'
export const WALLET_TRANSACTION_UPDATED = 'mainWallet/TRANSACTION_UPDATED'
export const WALLET_TRANSACTION = 'mainWallet/TRANSACTION'
export const WALLET_TRANSACTIONS = 'mainWallet/TRANSACTIONS'
export const WALLET_IS_TIME_REQUIRED = 'mainWallet/IS_TIME_REQUIRED'
export const WALLET_TOKEN_BALANCE = 'mainWallet/TOKEN_BALANCE'
export const WALLET_INIT = 'mainWallet/INIT'
export const WALLET_SET_NAME = 'mainWallet/SET_NAME'
export const WALLET_ESTIMATE_GAS_FOR_DEPOSIT = 'mainWallet/ESTIMATE_GAS_FOR_DEPOSIT'

export const ETH = 'ETH'
export const TIME = 'TIME'
export const LHT = 'LHT'
export const BTC = 'BTC'
export const BCC = 'BCC'
export const BTG = 'BTG'
export const LTC = 'LTC'
export const XEM = 'XEM'
export const WAVES = 'WAVES'

export const FEE_RATE_MULTIPLIER = {
  min: 0.1,
  max: 1.9,
  step: 0.1,
}

export const goToWallets = () => (dispatch) => dispatch(push('/wallets'))

export const goBackForAddWalletsForm = () => (dispatch, getState) => {
  const selector = formValueSelector(FORM_ADD_NEW_WALLET)
  const state = getState()
  let blockchain = selector(state, 'blockchain')
  let ethWalletType = selector(state, 'ethWalletType')

  if (ethWalletType) {
    dispatch(change(FORM_ADD_NEW_WALLET, 'ethWalletType', null))
    return
  }

  if (blockchain) {
    dispatch(change(FORM_ADD_NEW_WALLET, 'blockchain', null))
    return
  }
  history.goBack()
}

const handleToken = (token: TokenModel) => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)

  const symbol = token.symbol()
  const tokenDAO = tokenService.getDAO(token.id())

  // subscribe
  tokenDAO
    .on(EVENT_NEW_TRANSFER, (tx: TxModel) => {
      const walletsAccounts = getDeriveWalletsAddresses(getState(), token.blockchain())
      const mainWalletAddresses = getMainAddresses(getState())
      const assetDonatorDAO = daoByType('AssetDonator')(getState())

      const isMainWalletFrom = tx.from().split(',').some((from) => mainWalletAddresses.includes(from))
      const isMainWalletTo = tx.to().split(',').some((to) => mainWalletAddresses.includes(to))
      const isMultiSigWalletsFrom = tx.from().split(',').some((from) => walletsAccounts.includes(from))
      const isMultiSigWalletsTo = tx.to().split(',').some((to) => walletsAccounts.includes(to))

      if (isMainWalletFrom || isMainWalletTo || isMultiSigWalletsFrom || isMultiSigWalletsTo || tx.from() === account || tx.to() === account) {
        if (mainWalletAddresses.includes(tx.from()) || mainWalletAddresses.includes(tx.to()) ||
          walletsAccounts.includes(tx.from()) || walletsAccounts.includes(tx.to()) ||
          tx.from() === account || tx.to() === account) {
          dispatch(notify(new TransferNoticeModel({
            value: token.removeDecimals(tx.value()),
            symbol,
            from: tx.from(),
            to: tx.to(),
          })))
        }

        if (isMainWalletFrom || isMainWalletTo || tx.from() === account || tx.to() === account) { // for main wallet
          // add to table
          // TODO @dkchv: !!! restore after fix
          dispatch({ type: WALLET_TRANSACTION, tx })

          if (!(tx.from() === account || tx.to() === account)) {
            return
          }
          // update donator
          if (tx.from() === assetDonatorDAO.getInitAddress()) {
            dispatch(updateIsTIMERequired())
          }
        }

        if (walletsAccounts.includes(tx.from()) || walletsAccounts.includes(tx.to())) { // for derive wallets
          const setDerivedWalletBalance = async (wallet: DerivedWalletModel) => {

            dispatch({ type: MULTISIG_FETCHED, wallet: wallet.set('transactions', wallet.transactions().add(tx)) })

            const dao = tokenService.getDAO(token)
            const balance = await dao.getAccountBalance(wallet.address())
            dispatch({
              type: MULTISIG_BALANCE,
              walletId: wallet.address(),
              balance: new BalanceModel({
                id: token.id(),
                amount: new Amount(balance, token.symbol(), true),
              }),
            })
          }

          const walletFrom = getState().get(DUCK_MULTISIG_WALLET).item(tx.from())
          if (walletFrom && walletFrom.isFetched()) {
            setDerivedWalletBalance(walletFrom)
          }
          const walletTo = getMultisigWallets(getState()).item(tx.to())
          if (walletTo && walletTo.isFetched()) {
            setDerivedWalletBalance(walletTo)
          }
        }
      }
    })
    .on(EVENT_UPDATE_BALANCE, ({ account, balance }) => {
      const wallets = getState().get(DUCK_MULTISIG_WALLET)
      if (wallets.item(account)) {
        dispatch({
          type: MULTISIG_BALANCE,
          walletId: account,
          balance: new BalanceModel({
            id: token.id(),
            amount: new Amount(balance, token.symbol(), true),
          }),
        })
      } else {
        const addresses = getState().get(DUCK_MAIN_WALLET)
          .addresses()
          .items()
          .map((address: AddressModel) => address.address())

        if (addresses.includes(account)) {
          dispatch({
            type: WALLET_TOKEN_BALANCE,
            balance: new BalanceModel({
              id: token.id(),
              amount: new Amount(balance, token.symbol()),
            }),
          })
        }
      }
    })
    .on(EVENT_APPROVAL_TRANSFER, ({ spender, value }) => {
      dispatch(notify(new ApprovalNoticeModel({
        value: token.removeDecimals(value),
        symbol,
        spender,
      })))

      dispatch({
        type: WALLET_ALLOWANCE, allowance: new AllowanceModel({
          amount: new Amount(value, token.id()),
          spender,
          token: token.id(),
          isFetching: false,
          isFetched: true,
        }),
      })
    })
    .on(EVENT_UPDATE_TRANSACTION, ({ tx }) => {
      dispatch({
        type: WALLET_TRANSACTION_UPDATED,
        tx,
      })
    })

  // dispatch(fetchTokenBalance(token, account))

  dispatch(addMarketToken(token.symbol()))

  if (token.symbol() === 'TIME') {
    dispatch(updateIsTIMERequired())
  }

  // loading transaction for Current transaction list
  if (token.blockchain() && !token.isERC20()) {
    let address = getState().get(DUCK_MAIN_WALLET).addresses().item(token.blockchain())
    if (address.address()) {
      dispatch(getTransactionsForWallet({
        wallet: getState().get(DUCK_MAIN_WALLET),
        address: address.address(),
        blockchain: token.blockchain(),
        forcedOffset: true,
      }))
    }
  }
}

export const fetchTokenBalance = (token: TokenModel, account) => async (dispatch) => {
  const tokenDAO = tokenService.getDAO(token.id())
  const balance = await tokenDAO.getAccountBalance(token.blockchain() === BLOCKCHAIN_ETHEREUM ? account : null)
  dispatch({
    type: WALLET_TOKEN_BALANCE,
    balance: new BalanceModel({
      id: token.id(),
      amount: new Amount(balance, token.symbol()),
    }),
  })
}

export const initMainWallet = () => async (dispatch) => {
  dispatch({ type: WALLET_INIT, isInited: true })

  dispatch(subscribeOnTokens(handleToken))

  const providers = [
    bccProvider,
    btgProvider,
    ltcProvider,
    btcProvider,
    nemProvider,
    wavesProvider,
    ethereumProvider,
  ]
  providers.map((provider) => {
    dispatch({
      type: WALLET_ADDRESS, address: new AddressModel({
        id: provider.id(),
        address: provider.getAddress(),
      }),
    })
  })
}

export const mainTransfer = (wallet: WalletModel, token: TokenModel, amount: Amount, recipient: string, feeMultiplier: Number = 1, additionalOptions = {}) => async (dispatch) => {
  try {
    const tokenDAO = tokenService.getDAO(token.id())

    const tx: TxExecModel = await tokenDAO.transfer(
      wallet.address,
      recipient,
      amount,
      token,
      feeMultiplier,
      additionalOptions,
    )

    if (tx && tx.blockchain === BLOCKCHAIN_ETHEREUM) {
      dispatch(sendNewTx(tx))
    }
  } catch (e) {
    // eslint-disable-next-line
    console.error('e', e)
    dispatch(notifyError(e, 'mainTransfer'))
  }
}

const updateAllowance = (allowance) => (dispatch, getState) => {
  const wallet = getMainEthWallet(getState())
  if (allowance) {
    dispatch({
      type: WALLETS_UPDATE_WALLET,
      wallet: new WalletModel({
        ...wallet,
        allowances: new AllowanceCollection({
          list: {
            ...wallet.allowances.list,
            [allowance.id()]: allowance,
          },
        }),
      }),
    })
  }
}

export const mainApprove = (token: TokenModel, amount: Amount, spender: string, feeMultiplier: Number, additionalOptions = undefined) => async (dispatch, getState) => {
  const wallet = getMainEthWallet(getState())
  const allowance = wallet.allowances[`${spender}-${token.id()}`]
  const { account } = getState().get(DUCK_SESSION)

  try {
    dispatch(updateAllowance(allowance.isFetching(true)))
    const tokenDAO = tokenService.getDAO(token)
    additionalOptions['from'] = account
    const tx = await tokenDAO.approve(spender, amount, feeMultiplier, additionalOptions)
    dispatch(sendNewTx(tx))
  } catch (e) {
    // eslint-disable-next-line
    console.log('mainRevoke approve: ', e)
    dispatch(notifyError(e, 'mainApprove'))
    dispatch(updateAllowance(allowance.isFetching(false)))
  }
}

export const mainRevoke = (token: TokenModel, spender: string, feeMultiplier: Number = 1, additionalOptions = undefined) => async (dispatch, getState) => {
  const wallet = getMainEthWallet(getState())
  const allowance = wallet.allowances[`${spender}-${token.id()}`]
  dispatch(updateAllowance(allowance.isFetching(true)))

  const { account } = getState().get(DUCK_SESSION)
  try {
    dispatch({ type: WALLET_ALLOWANCE, allowance: allowance.isFetching(true) })
    const tokenDAO = tokenService.getDAO(token)
    additionalOptions['from'] = account
    const tx = await tokenDAO.revoke(spender, token.symbol(), feeMultiplier, additionalOptions)
    dispatch(sendNewTx(tx))
  } catch (e) {
    // eslint-disable-next-line
    console.log('mainRevoke error: ', e)
    dispatch(notifyError(e, 'mainRevoke'))
    dispatch(updateAllowance(allowance.isFetching(false)))
  }
}

export const updateIsTIMERequired = () => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const wallet = getMainEthWallet(getState())
  try {
    const assetDonatorDAO = daoByType('AssetDonator')(getState())
    const isTIMERequired = await assetDonatorDAO.isTIMERequired(account)
    dispatch({
      type: WALLETS_SET_IS_TIME_REQUIRED,
      walletId: wallet.id,
      isTIMERequired,
    })
  } catch (e) {
    // eslint-disable-next-line
    console.error('require time error', e.message)
  }
}

export const requireTIME = () => async (dispatch, getState) => {
  try {
    const account = getAccount(getState())
    const assetDonatorDAO = daoByType('AssetDonator')(getState())
    const tx = await assetDonatorDAO.requireTIME(account)
    dispatch(sendNewTx(tx))
  } catch (e) {
    // eslint-disable-next-line
    console.error('require time error', e.message)
  }
}

export const getSpendersAllowance = (tokenId: string, spender: string) => async (dispatch, getState) => {
  if (validator.address(spender) !== null || !tokenId) {
    return null
  }
  const { account } = getState().get(DUCK_SESSION)
  const dao = tokenService.getDAO(tokenId)
  const allowance = await dao.getAccountAllowance(account, spender)
  dispatch({
    type: WALLET_ALLOWANCE, allowance: new AllowanceModel({
      amount: new Amount(allowance, tokenId),
      spender, //address
      token: tokenId, // id
      isFetching: false,
      isFetched: true,
    }),
  })
}

export const estimateGasForDeposit = (mode: string, params, callback, gasPriceMultiplier = 1) => async (dispatch, getState) => {
  let dao = null
  const web3 = getState('web3')
  switch (mode) {
    case TX_APPROVE:
      dao = await tokenService.getDAO(TIME, web3)
      break
    case TX_DEPOSIT:
    case TX_WITHDRAW_SHARES:
      dao = daoByType('TimeHolder')(getState())
      break
  }
  try {
    if (!dao) {
      throw new Error('Dao is undefined')
    }
    console.log('DAO actions: ', dao)
    const { gasLimit, gasFee, gasPrice } = await dao.estimateGas(...params)
    callback(null, {
      gasLimit,
      gasFee: new Amount(gasFee.mul(gasPriceMultiplier), ETH),
      gasPrice: new Amount(gasPrice.mul(gasPriceMultiplier), ETH),
    })
  } catch (e) {
    callback(e)
  }
  dispatch({ type: WALLET_ESTIMATE_GAS_FOR_DEPOSIT })
}

export const getTokensBalancesAndWatch = (address, blockchain, customTokens: Array<string>) => (token) => async (dispatch) => {
  if (blockchain !== token.blockchain() || (token.symbol() !== ETH && customTokens && !customTokens.includes(token.symbol()))) {
    return null
  }
  // const dao = tokenService.getDAO(token)
  // await dao.watch(address)
}

export const createNewChildAddress = ({ blockchain, tokens, name, deriveNumber }) => async (dispatch, getState) => {
  const account = getState().get(DUCK_SESSION).account
  const wallets = getMultisigWallets(getState())
  let ownersCollection = new OwnerCollection()
  ownersCollection = ownersCollection.update(new OwnerModel({
    address: account,
    isSelf: true,
  }))

  let lastDeriveNumbers = {}
  wallets
    .items()
    .map((wallet) => {
      const isOwner = wallet.owners().items().filter((owner) => owner.address() === account).length > 0
      if (wallet instanceof DerivedWalletModel && isOwner) {
        const deriveNumber = wallet.deriveNumber ? wallet.deriveNumber() : null
        if (!lastDeriveNumbers[wallet.blockchain()] || (lastDeriveNumbers[wallet.blockchain()] && lastDeriveNumbers[wallet.blockchain()] < deriveNumber)) {
          lastDeriveNumbers[wallet.blockchain()] = deriveNumber
        }
      }
    })

  let wallet
  let newDeriveNumber = deriveNumber
  let newWallet
  let address

  switch (blockchain) {
    case BLOCKCHAIN_ETHEREUM:
      if (newDeriveNumber === undefined || newDeriveNumber === null) {
        newDeriveNumber = lastDeriveNumbers.hasOwnProperty(blockchain) ? lastDeriveNumbers[blockchain] + 1 : 0
      }
      newWallet = ethereumProvider.createNewChildAddress(newDeriveNumber)
      address = newWallet.getAddressString()

      ethereumProvider.addNewEthWallet(newDeriveNumber)
      break
    case BLOCKCHAIN_BITCOIN:
      if (newDeriveNumber === undefined || newDeriveNumber === null) {
        newDeriveNumber = lastDeriveNumbers.hasOwnProperty(blockchain) ? lastDeriveNumbers[blockchain] + 1 : 0
      }
      newWallet = btcProvider.createNewChildAddress(newDeriveNumber)
      address = newWallet.getAddress()
      btcProvider.subscribeNewWallet(address)
      break
    case BLOCKCHAIN_LITECOIN:
      if (newDeriveNumber === undefined || newDeriveNumber === null) {
        newDeriveNumber = lastDeriveNumbers.hasOwnProperty(blockchain) ? lastDeriveNumbers[blockchain] + 1 : 0
      }
      newWallet = ltcProvider.createNewChildAddress(newDeriveNumber)
      address = newWallet.getAddress()
      ltcProvider.subscribeNewWallet(address)
      break
    case 'Bitcoin Gold':
    case 'NEM':
    case 'WAVES':
    default:
      return null
  }

  wallet = new DerivedWalletModel({
    name,
    address,
    addresses: new AddressesCollection()
      .add(new AddressModel({ id: blockchain, address })),
    owners: ownersCollection,
    isMultisig: false,
    isFetched: true,
    deriveNumber: newDeriveNumber,
    blockchain,
    customTokens: tokens,
  })

  dispatch({ type: MULTISIG_FETCHED, wallet })
  dispatch(subscribeOnTokens(getTokensBalancesAndWatch(address, blockchain, tokens)))
}

export const resetWalletsForm = () => (dispatch) => {
  dispatch(change(FORM_ADD_NEW_WALLET, 'blockchain', null))
  dispatch(change(FORM_ADD_NEW_WALLET, 'ethWalletType', null))
}

/**
 * Format data for transaction widget
 *
 * @param wallet - WalletModel
 * @param address - string
 * @param blockchain - string
 * @returns {function(*, *): *}
 */
export const formatDataAndGetTransactionsForWallet = ({ wallet, address, blockchain }) => async (dispatch) => {
  return dispatch(getTransactionsForWallet({ wallet, address, blockchain }))
}

export const getTransactionsForWallet = ({ wallet, forcedOffset }) => async (dispatch, getState) => {
  // TODO remove if
  if (wallet instanceof MainWalletModel) {
    return null
  }
  if (!wallet) {
    return null
  }
  const tokens = getState().get(DUCK_TOKENS)

  dispatch({
    type: WALLETS_UPDATE_WALLET,
    wallet: new WalletModel({
      ...wallet,
      transactions: new TxHistoryModel(
        {
          ...wallet.transactions,
          isFetching: true,
        }),
    }),
  })

  let transactions: TxHistoryModel = new TxHistoryModel({ ...wallet.transactions, isFetched: true, isFetching: false }) || new TxHistoryModel()
  const offset = forcedOffset ? 0 : (transactions.size() || 0)
  const newOffset = offset + TXS_PER_PAGE

  let txList = []
  let dao

  switch (wallet.blockchain) {
    case BLOCKCHAIN_ETHEREUM:
      dao = tokenService.getDAO(ETH)
      break
    case BLOCKCHAIN_BITCOIN:
      dao = tokenService.getDAO(BTC)
      break
    case BLOCKCHAIN_BITCOIN_CASH:
      dao = tokenService.getDAO(BCC)
      break
    case BLOCKCHAIN_BITCOIN_GOLD:
      dao = tokenService.getDAO(BTG)
      break
    case BLOCKCHAIN_LITECOIN:
      dao = tokenService.getDAO(LTC)
      break
    case BLOCKCHAIN_NEM:
      dao = tokenService.getDAO(XEM)
      break
    case BLOCKCHAIN_WAVES:
      dao = tokenService.getDAO(WAVES)
      break
  }

  if (dao) {
    txList = await dao.getTransfer(wallet.address, wallet.address, offset, TXS_PER_PAGE, tokens)

    txList.sort((a, b) => b.get('time') - a.get('time'))

    for (let tx: TxModel of txList) {
      transactions = transactions.add(tx)
    }

    if (transactions.items().length < newOffset) {
      transactions = transactions.endOfList(true)
    } else {
      transactions = transactions.endOfList(false)
    }
  }

  const newWallet = getWallet(wallet.id)(getState())
  dispatch({ type: WALLETS_UPDATE_WALLET, wallet: new WalletModel({ ...newWallet, transactions }) })
}
