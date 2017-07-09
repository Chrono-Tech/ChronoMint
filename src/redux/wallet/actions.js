import Immutable from 'immutable'
import BigNumber from 'bignumber.js'

// TODO @bshevchenko: wrong eslint inspection
// eslint-disable-next-line
import type TxModel from 'models/TxModel'

import AbstractTokenDAO, { TXS_PER_PAGE } from 'dao/AbstractTokenDAO'
import TransferNoticeModel from 'models/notices/TransferNoticeModel'
import TokenModel from 'models/TokenModel'

import { notify } from 'redux/notifier/actions'

import contractsManagerDAO from 'dao/ContractsManagerDAO'
import ethereumDAO from 'dao/EthereumDAO'
import assetDonatorDAO from 'dao/AssetDonatorDAO'
import ls from 'utils/LocalStorage'

export const WALLET_TOKENS_FETCH = 'wallet/TOKENS_FETCH'
export const WALLET_TOKENS = 'wallet/TOKENS'
export const WALLET_BALANCE_FETCH = 'wallet/BALANCE_FETCH'
export const WALLET_BALANCE = 'wallet/BALANCE'
export const WALLET_TIME_DEPOSIT_FETCH = 'wallet/TIME_DEPOSIT_FETCH'
export const WALLET_TIME_DEPOSIT = 'wallet/TIME_DEPOSIT'
export const WALLET_TRANSACTIONS_FETCH = 'wallet/TRANSACTIONS_FETCH'
export const WALLET_TRANSACTION = 'wallet/TRANSACTION'
export const WALLET_TRANSACTIONS = 'wallet/TRANSACTIONS'
export const WALLET_IS_TIME_REQUIRED = 'wallet/IS_TIME_REQUIRED'

export const balanceFetch = (symbol) => ({type: WALLET_BALANCE_FETCH, symbol})
const timeDepositFetch = () => ({type: WALLET_TIME_DEPOSIT_FETCH})

export const ETH = 'ETH'
export const TIME = 'TIME'

export const watchTransfer = (notice: TransferNoticeModel, token: AbstractTokenDAO) => (dispatch) => {
  dispatch(updateBalance(token))
  dispatch(notify(notice))
  dispatch({type: WALLET_TRANSACTION, tx: notice.tx()})
}

// TODO @ipavlenko: Refactor this, provide ability to detach watchers
export const watchInitWallet = () => async (dispatch, getState) => {
  const state = getState()
  const profile = state.get('session').profile

  dispatch({type: WALLET_TOKENS_FETCH})
  const dao = await contractsManagerDAO.getERC20ManagerDAO()
  let tokens = await dao.getUserTokens(profile.tokens().toArray())
  dispatch({type: WALLET_TOKENS, tokens})

  dispatch(getAccountTransactions(tokens))

  tokens = tokens.valueSeq().toArray()
  for (let token of tokens) {
    const dao = token.dao()
    await dao.watchTransfer((notice) => dispatch(watchTransfer(notice, dao)))
  }

  ethereumDAO.watchPending(() => {
    for (let token of tokens) {
      const dao = token.dao()
      dispatch(updateBalance(dao))
    }
  })
}

export const watchRefreshWallet = () => async (dispatch, getState) => {
  const state = getState()
  const profile = state.get('session').profile
  const previous = state.get('wallet').tokens

  dispatch({type: WALLET_TOKENS_FETCH})
  const dao = await contractsManagerDAO.getERC20ManagerDAO()
  let tokens = await dao.getUserTokens(profile.tokens().toArray())
  dispatch({type: WALLET_TOKENS, tokens})

  dispatch(getAccountTransactions(tokens))

  const toStopArray = previous.filter((k) => !tokens.get(k)).valueSeq().toArray().map((token) => {
    const dao = token.dao()
    return dao.stopWatching()
  })

  if (toStopArray.length) {
    await Promise.all(toStopArray)
  }

  tokens = tokens.filter((k) => !previous.get(k)).valueSeq().toArray()
  for (let token of tokens) {
    const dao = token.dao()
    await dao.watchTransfer((notice) => dispatch(watchTransfer(notice, dao)))
  }
}

export const updateBalance = (tokenDAO: AbstractTokenDAO) => async (dispatch) => {
  const symbol = tokenDAO.getSymbol()
  dispatch(balanceFetch(symbol))
  const balance = await tokenDAO.getAccountBalance(ls.getAccount(), 'pending')
  dispatch({type: WALLET_BALANCE, symbol, balance})
}

export const transfer = (token: TokenModel, amount: string, recipient, total: BigNumber) => async (dispatch) => {
  const symbol = token.symbol()
  const previous = new BigNumber(String(token.balance()))
  const expected = previous.minus(total)

  dispatch({type: WALLET_BALANCE, symbol, balance: expected})
  try {
    const tokenDAO = await token.dao()
    await tokenDAO.transfer(recipient, amount)
    dispatch(updateBalance(tokenDAO))
  } catch (e) {
    dispatch({type: WALLET_BALANCE, symbol, balance: previous})
  }
}

export const updateTIMEBalance = () => async (dispatch) => {
  const tokenDAO = await contractsManagerDAO.getTIMEDAO()
  return dispatch(updateBalance(tokenDAO))
}

export const updateTIMEDeposit = () => async (dispatch) => {
  const dao = await contractsManagerDAO.getTIMEHolderDAO()
  const deposit = await dao.getAccountDepositBalance(ls.getAccount())
  dispatch({type: WALLET_TIME_DEPOSIT, deposit})
}

export const updateIsTIMERequired = (value = ls.getIsTIMERequired()) => (dispatch) => {
  dispatch({type: WALLET_IS_TIME_REQUIRED, value})
  ls.lockIsTIMERequired(value)
}

export const requireTIME = () => async (dispatch) => {
  dispatch(balanceFetch(TIME))
  try {
    await assetDonatorDAO.requireTIME()
    dispatch(updateIsTIMERequired(true))
  } catch (e) {
    dispatch(updateIsTIMERequired(false))
  }
  dispatch(updateTIMEBalance())
}

export const depositTIME = (amount, token) => async (dispatch) => {
  const previous = new BigNumber(String(token.balance()))
  const expected = previous.minus(amount)

  dispatch({type: WALLET_BALANCE, symbol: TIME, balance: expected})
  try {
    const dao = await contractsManagerDAO.getTIMEHolderDAO()
    await dao.deposit(amount)
    dispatch(updateTIMEBalance())
  } catch (e) {
    dispatch({type: WALLET_BALANCE, symbol: TIME, balance: previous})
  }
  dispatch(updateTIMEDeposit())
}

export const withdrawTIME = (amount) => async (dispatch) => {
  dispatch(balanceFetch(TIME))
  dispatch(timeDepositFetch())
  try {
    const dao = await contractsManagerDAO.getTIMEHolderDAO()
    await dao.withdraw(amount)
  } catch (e) {
    // no revert logic
  }
  dispatch(updateTIMEBalance())
  dispatch(updateTIMEDeposit())
}

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
      promises.push(token.dao().getTransfer(ls.getAccount(), getTransferId))
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
