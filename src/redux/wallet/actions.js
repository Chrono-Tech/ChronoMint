import Immutable from 'immutable'

import AbstractTokenDAO from '../../dao/AbstractTokenDAO'
import TransferNoticeModel from '../../models/notices/TransferNoticeModel'
import TokenModel from '../../models/TokenModel'
import TransactionModel from '../../models/TransactionModel'

import { showAlertModal, hideModal } from '../ui/modal'
import { notify } from '../notifier/notifier'

import contractsManagerDAO from '../../dao/ContractsManagerDAO'
import ls from '../../utils/LocalStorage'

export const WALLET_TOKENS_FETCH = 'wallet/TOKENS_FETCH'
export const WALLET_TOKENS = 'wallet/TOKENS'
export const WALLET_BALANCE_FETCH = 'wallet/BALANCE_FETCH'
export const WALLET_BALANCE = 'wallet/BALANCE'
export const WALLET_TIME_DEPOSIT = 'wallet/TIME_DEPOSIT'
export const WALLET_TRANSACTIONS_FETCH = 'wallet/TRANSACTIONS_FETCH'
export const WALLET_TRANSACTION = 'wallet/TRANSACTION'
export const WALLET_TRANSACTIONS = 'wallet/TRANSACTIONS'

export const balanceFetch = (symbol) => ({type: WALLET_BALANCE_FETCH, symbol})

export const TIME = 'TIME'

export const watchTransfer = (notice: TransferNoticeModel, token: AbstractTokenDAO, isOld) => (dispatch) => {
  dispatch(updateBalance(token))
  dispatch(notify(notice, isOld))
  if (!isOld) {
    const tx = notice.tx()
    dispatch({type: WALLET_TRANSACTION, tx})
  }
}

export const watchInitWallet = () => async (dispatch) => {
  dispatch({type: WALLET_TOKENS_FETCH})
  const dao = await contractsManagerDAO.getERC20ManagerDAO()
  let tokens = await dao.getTokens()
  dispatch({type: WALLET_TOKENS, tokens})

  dispatch(getAccountTransactions(tokens))

  tokens = tokens.valueSeq().toArray()
  for (let token of tokens) {
    const dao = token.dao()
    await dao.watchTransfer((notice, isOld) => {
      dispatch(watchTransfer(notice, dao, isOld))
    })
  }
}

export const updateBalance = (token: AbstractTokenDAO) => async (dispatch) => {
  const balance = await token.getAccountBalance(ls.getAccount())
  dispatch({type: WALLET_BALANCE, symbol: token.getSymbol(), balance})
}

export const transfer = (token: TokenModel, amount: string, recipient) => async (dispatch) => {
  dispatch(balanceFetch(token.symbol()))
  try {
    const dao = await token.dao()
    await dao.transfer(amount, recipient)
    dispatch(updateBalance(token.dao()))
  } catch (e) {
    dispatch(showAlertModal({title: token.symbol() + ' transfer error', message: e.message}))
    dispatch(balanceFetch(token.symbol()))
  }
}

export const updateTIMEBalance = () => async (dispatch) => {
  dispatch(balanceFetch(TIME))
  const token = await contractsManagerDAO.getTIMEDAO()
  return dispatch(updateBalance(token))
}

export const updateTIMEDeposit = () => async (dispatch) => {
  const dao = await contractsManagerDAO.getTIMEHolderDAO()
  const deposit = await dao.getAccountDepositBalance(ls.getAccount())
  dispatch({type: WALLET_TIME_DEPOSIT, deposit})
}

// TODO This is only for test purposes
// export const requireTIME = () => async (dispatch) => {
//   dispatch(hideModal())
//   dispatch(balanceFetch(TIME))
//   try {
//     await TokenContractsDAO.requireTIME()
//     const token = await contractsManagerDAO.getTIMEDAO()
//     return dispatch(updateBalance(token))
//   } catch (e) {
//     dispatch(balanceFetch(TIME))
//   }
// }

export const depositTIME = (amount) => async (dispatch) => {
  dispatch(hideModal())
  dispatch(balanceFetch(TIME))
  try {
    const dao = await contractsManagerDAO.getTIMEHolderDAO()
    const result = await dao.deposit(amount)
    dispatch(updateTIMEBalance())
    if (result) {
      dispatch(updateTIMEDeposit())
    } else {
      dispatch(showAlertModal({title: 'Deposit TIME error', message: 'Insufficient funds.'}))
    }
  } catch (e) {
    dispatch(balanceFetch(TIME))
  }
}

export const withdrawTIME = (amount) => async (dispatch) => {
  dispatch(hideModal())
  dispatch(balanceFetch(TIME))
  try {
    const dao = await contractsManagerDAO.getTIMEHolderDAO()
    const result = await dao.withdraw(amount)
    dispatch(updateTIMEBalance())
    if (result) {
      dispatch(updateTIMEDeposit())
    } else {
      dispatch(showAlertModal({title: 'Withdraw TIME error', message: 'Insufficient funds.'}))
    }
  } catch (e) {
    dispatch(balanceFetch(TIME))
  }
}

const getTransferId = 'wallet'
const txsTotal = 10
let lastTokens
let txsCache = []

export const getAccountTransactions = (tokens) => async (dispatch) => {
  dispatch({type: WALLET_TRANSACTIONS_FETCH})

  const reset = lastTokens && tokens !== lastTokens
  lastTokens = tokens
  if (reset) {
    txsCache = []
  }

  let txs = txsCache.slice(0, txsTotal)
  txsCache = txsCache.slice(txsTotal)

  if (txs.length < txsTotal) { // so cache is empty
    const promises = []
    tokens = tokens.valueSeq().toArray()
    for (let token of tokens) {
      if (reset) {
        token.dao().resetGetCache(getTransferId)
      }
      promises.push(token.dao().getTransfer(ls.getAccount(), getTransferId))
    }
    const result = await Promise.all(promises)

    let newTxs = []
    for (let pack of result) {
      newTxs = [...newTxs, ...pack]
    }

    newTxs.sort((a, b) => {
      if (a.get('time') < b.get('time')) {
        return -1
      }
      if (a.get('time') > b.get('time')) {
        return -1
      }
      return 0
    })

    txs = [...txs, ...newTxs]
    txsCache = txs.slice(txsTotal)
    txs = txs.slice(0, txsTotal)
  }

  let map = new Immutable.Map()
  for (let tx: TransactionModel of txs) {
    map = map.set(tx.id(), tx)
  }

  dispatch({type: WALLET_TRANSACTIONS, map})
}
