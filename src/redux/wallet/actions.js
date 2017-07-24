import Immutable from 'immutable'
import BigNumber from 'bignumber.js'

import type TxModel from 'models/TxModel'
import type ProfileModel from 'models/ProfileModel'
import ApprovalNoticeModel from 'models/notices/ApprovalNoticeModel'
import TransferNoticeModel from 'models/notices/TransferNoticeModel'
import TokenModel from 'models/TokenModel'
import { TXS_PER_PAGE } from 'dao/AbstractTokenDAO'

import { notify } from 'redux/notifier/actions'

import contractsManagerDAO from 'dao/ContractsManagerDAO'
import ethereumDAO from 'dao/EthereumDAO'
import assetDonatorDAO from 'dao/AssetDonatorDAO'

export const WALLET_TOKENS_FETCH = 'wallet/TOKENS_FETCH'
export const WALLET_TOKENS = 'wallet/TOKENS'
export const WALLET_BALANCE = 'wallet/BALANCE'
export const WALLET_ALLOWANCE = 'wallet/ALLOWANCE'
export const WALLET_TIME_DEPOSIT = 'wallet/TIME_DEPOSIT'
export const WALLET_TIME_ADDRESS = 'wallet/TIME_ADDRESS'
export const WALLET_TRANSACTIONS_FETCH = 'wallet/TRANSACTIONS_FETCH'
export const WALLET_TRANSACTION = 'wallet/TRANSACTION'
export const WALLET_TRANSACTIONS = 'wallet/TRANSACTIONS'
export const WALLET_IS_TIME_REQUIRED = 'wallet/IS_TIME_REQUIRED'

export const ETH = ethereumDAO.getSymbol()
export const TIME = 'TIME'

const updateBalance = (token: TokenModel, isCredited, amount: BigNumber) =>
  ({type: WALLET_BALANCE, token, isCredited, amount})
export const balancePlus = (amount: BigNumber, token: TokenModel) => updateBalance(token, true, amount)
export const balanceMinus = (amount: BigNumber, token: TokenModel) => updateBalance(token, false, amount)

const updateDeposit = (amount: BigNumber, isCredited: ?boolean) => ({type: WALLET_TIME_DEPOSIT, isCredited, amount})
const depositPlus = (amount: BigNumber) => updateDeposit(amount, true)
const depositMinus = (amount: BigNumber) => updateDeposit(amount, false)

export const watchTransfer = (notice: TransferNoticeModel) => async (dispatch, getState) => {
  const tx: TxModel = notice.tx()
  const token: TokenModel = getState().get('wallet').tokens.get(tx.symbol())

  dispatch(updateBalance(token, tx.isCredited(), tx.value()))

  const timeHolderDAO = await contractsManagerDAO.getTIMEHolderDAO()
  const timeHolderAddress = await timeHolderDAO.getAddress()
  let updateTIMEAllowance = false
  if (tx.to() === timeHolderAddress) {
    dispatch(depositPlus(tx.value()))
    updateTIMEAllowance = true
  } else if (tx.from() === timeHolderAddress) {
    dispatch(depositMinus(tx.value()))
    updateTIMEAllowance = true
  }
  if (updateTIMEAllowance) {
    const dao = await token.dao()
    dispatch({
      type: WALLET_ALLOWANCE, token,
      value: await dao.getAccountAllowance(timeHolderAddress),
      spender: timeHolderAddress
    })
  }

  dispatch(notify(notice))
  dispatch({type: WALLET_TRANSACTION, tx})
}

export const watchInitWallet = () => async (dispatch, getState) => {
  const state = getState()
  const profile: ProfileModel = state.get('session').profile
  const previous = state.get('wallet').tokens

  dispatch({type: WALLET_TOKENS_FETCH})
  const dao = await contractsManagerDAO.getERC20ManagerDAO()
  let tokens = await dao.getUserTokens(profile.tokens().toArray())
  dispatch({type: WALLET_TOKENS, tokens})
  dispatch(getAccountTransactions(tokens))

  const toStopArray = previous.filter((k) => !tokens.get(k)).valueSeq().toArray().map((token: TokenModel) => {
    const dao = token.dao()
    return dao.stopWatching()
  })
  if (toStopArray.length) {
    await Promise.all(toStopArray)
  }

  const timeHolderDAO = await contractsManagerDAO.getTIMEHolderDAO()
  const timeHolderAddress = await timeHolderDAO.getAddress()
  let contractNames = {}
  contractNames[timeHolderAddress] = TIME + ' Holder'
  ApprovalNoticeModel.setContractNames(contractNames)
  dispatch({type: WALLET_TIME_ADDRESS, address: timeHolderAddress})

  tokens = tokens.filter((k) => !previous.get(k)).valueSeq().toArray()
  for (let token: TokenModel of tokens) {
    const dao = token.dao()
    await dao.watchTransfer((notice) => dispatch(watchTransfer(notice)))
    await dao.watchApproval((notice: ApprovalNoticeModel) => {
      dispatch({type: WALLET_ALLOWANCE, token, value: notice.value(), spender: notice.spender()})
      dispatch(notify(notice.setToken(token)))
    })
  }
}

export const transfer = (token: TokenModel, amount: string, recipient) => async (dispatch) => {
  amount = new BigNumber(amount)

  dispatch(balanceMinus(amount, token))

  try {
    const dao = await token.dao()
    await dao.transfer(recipient, amount)
  } catch (e) {
    // rollback is below, because we want to update balance in watchTransfer
  }
  // TODO @bshevchenko: there is delay before event is emitted, so dispatch below happens little early
  dispatch(balancePlus(amount, token))
}

export const approve = (token: TokenModel, amount: string, spender) => async () => {
  try {
    const dao = await token.dao()
    await dao.approve(spender, amount)
  } catch (e) {
    // no rollback
  }
}

export const depositTIME = (amount: string) => async (dispatch, getState) => {
  amount = new BigNumber(amount)
  const wallet = getState().get('wallet')
  const token: TokenModel = wallet.tokens.get(TIME)

  dispatch(balanceMinus(amount, token))

  try {
    const dao = await contractsManagerDAO.getTIMEHolderDAO()
    await dao.deposit(amount)
  } catch (e) {
    // rollback is below, because we want to update balance in watchTransfer
  }
  // TODO @bshevchenko: there is delay before event is emitted, so dispatch below happens little early
  dispatch(balancePlus(amount, token))
}

export const withdrawTIME = (amount: string) => async (dispatch) => {
  amount = new BigNumber(amount)

  dispatch(depositMinus(amount))

  try {
    const dao = await contractsManagerDAO.getTIMEHolderDAO()
    await dao.withdraw(amount)
  } catch (e) {
    // rollback is below, because we want to update balance in watchTransfer
  }
  dispatch(depositPlus(amount))
}

export const initTIMEDeposit = () => async (dispatch) => {
  const dao = await contractsManagerDAO.getTIMEHolderDAO()
  const deposit = await dao.getAccountDepositBalance()
  dispatch(updateDeposit(deposit, null))
}

export const updateIsTIMERequired = () => async (dispatch) => {
  dispatch({type: WALLET_IS_TIME_REQUIRED, value: await assetDonatorDAO.isTIMERequired()})
}

export const requireTIME = () => async (dispatch) => {
  try {
    await assetDonatorDAO.requireTIME()
  } catch (e) {
    // no rollback
  }
  dispatch(updateIsTIMERequired())
}

/**
 * LATEST TRANSACTIONS
 */
const getTransferId = 'wallet'
let lastCacheId
let txsCache = []

export const getAccountTransactions = (tokens) => async (dispatch) => {
  dispatch({type: WALLET_TRANSACTIONS_FETCH})

  tokens = tokens.valueSeq().toArray()

  const cacheId = Object.values(tokens).map((v: TokenModel) => v.symbol()).join(',')

  const reset = lastCacheId && cacheId !== lastCacheId
  lastCacheId = cacheId
  if (reset) {
    txsCache = []
  }

  let txs = txsCache.slice(0, TXS_PER_PAGE)
  txsCache = txsCache.slice(TXS_PER_PAGE)

  if (txs.length < TXS_PER_PAGE) { // so cache is empty
    const promises = []
    for (let token of tokens) {
      if (reset) {
        token.dao().resetFilterCache(getTransferId)
      }
      promises.push(token.dao().getTransfer(getTransferId))
    }
    const result = await Promise.all(promises)

    let newTxs = []
    for (let pack of result) {
      newTxs = [...newTxs, ...pack]
    }

    newTxs.sort((a, b) => b.get('time') - a.get('time'))

    txs = [...txs, ...newTxs]
    txsCache = txs.slice(TXS_PER_PAGE)
    txs = txs.slice(0, TXS_PER_PAGE)
  }

  let map = new Immutable.Map()
  for (let tx: TxModel of txs) {
    map = map.set(tx.id(), tx)
  }

  dispatch({type: WALLET_TRANSACTIONS, map})
}
