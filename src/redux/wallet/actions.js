import Immutable from 'immutable'
import AbstractTokenDAO from '../../dao/AbstractTokenDAO'
import ContractsManagerDAO from '../../dao/ContractsManagerDAO'
import TransferNoticeModel from '../../models/notices/TransferNoticeModel'
import TokenModel from '../../models/TokenModel'
import { showAlertModal, hideModal } from '../ui/modal'
import { notify } from '../notifier/notifier'
import LS from '../../utils/LocalStorage'
import Web3Provider from '../../network/Web3Provider'
import { exchangeTransaction } from '../exchange/actions'

export const WALLET_TOKENS_FETCH = 'wallet/TOKENS_FETCH'
export const WALLET_TOKENS = 'wallet/TOKENS'
export const WALLET_BALANCE_FETCH = 'wallet/BALANCE_FETCH'
export const WALLET_BALANCE = 'wallet/BALANCE'
export const WALLET_TIME_DEPOSIT = 'wallet/TIME_DEPOSIT'
export const WALLET_TRANSACTIONS_FETCH = 'wallet/TRANSACTIONS_FETCH'
export const WALLET_TRANSACTION = 'wallet/TRANSACTION'
export const WALLET_TRANSACTIONS = 'wallet/TRANSACTIONS'
export const WALLET_CM_BALANCE_LHT_FETCH = 'wallet/CM_BALANCE_LHT_FETCH'
export const WALLET_CM_BALANCE_LHT = 'wallet/CM_BALANCE_LHT'
// TODO Move this two actions...
export const WALLET_SEND_CM_LHT_TO_EXCHANGE_FETCH = 'wallet/SEND_CM_LHT_TO_EXCHANGE_FETCH'
// TODO ...to LOCs duck
export const WALLET_SEND_CM_LHT_TO_EXCHANGE_END = 'wallet/SEND_CM_LHT_TO_EXCHANGE_END'

export const balanceFetch = (symbol) => ({type: WALLET_BALANCE_FETCH, symbol})

export const TIME = 'TIME'

export const watchTransfer = (notice: TransferNoticeModel, token: AbstractTokenDAO, isOld) => (dispatch) => {
  dispatch(updateBalance(token))
  dispatch(notify(notice, isOld))
  if (!isOld) {
    const tx = notice.tx()
    dispatch({type: WALLET_TRANSACTION, tx})
    dispatch(exchangeTransaction(tx)) // TODO ???
  }
}

export const watchInitWallet = () => async (dispatch) => {
  dispatch({type: WALLET_TOKENS_FETCH})
  const dao = await ContractsManagerDAO.getERC20ManagerDAO()
  let tokens = await dao.getTokens()
  dispatch({type: WALLET_TOKENS, tokens})

  dispatch(getTransactionsByAccount(tokens))

  tokens = tokens.valueSeq().toArray()
  for (let token of tokens) {
    const dao = token.dao()
    await dao.watchTransfer((notice, isOld) => {
      dispatch(watchTransfer(notice, dao, isOld))
    })
  }
}

export const updateBalance = (token: AbstractTokenDAO) => async (dispatch) => {
  const balance = await token.getAccountBalance(LS.getAccount())
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
  const token = await ContractsManagerDAO.getTIMEDAO()
  return dispatch(updateBalance(token))
}

export const updateTIMEDeposit = () => async (dispatch) => {
  const dao = await ContractsManagerDAO.getTIMEHolderDAO()
  const deposit = await dao.getAccountDepositBalance(LS.getAccount())
  dispatch({type: WALLET_TIME_DEPOSIT, deposit})
}

// export const requireTIME = () => async (dispatch) => {
//   dispatch(hideModal())
//   dispatch(balanceFetch(TIME))
//   try {
//     await TokenContractsDAO.requireTIME()
//     const token = await ContractsManagerDAO.getTIMEDAO()
//     return dispatch(updateBalance(token))
//   } catch (e) {
//     dispatch(balanceFetch(TIME))
//   }
// }

export const depositTIME = (amount) => async (dispatch) => {
  dispatch(hideModal())
  dispatch(balanceFetch(TIME))
  try {
    const dao = await ContractsManagerDAO.getTIMEHolderDAO()
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
    const dao = await ContractsManagerDAO.getTIMEHolderDAO()
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

// export const updateCMLHTBalance = () => (dispatch) => { // CM => ContractsManager
//   dispatch({type: WALLET_CM_BALANCE_LHT_FETCH})
//   return TokenContractsDAO.getLHTBalance()
//     .then(balance => dispatch({type: WALLET_CM_BALANCE_LHT, balance}))
// }

// export const sendLHToExchange = (amount) => (dispatch) => {
//   dispatch(hideModal())
//   dispatch({type: WALLET_SEND_CM_LHT_TO_EXCHANGE_FETCH})
//   return TokenContractsDAO.sendLHTToExchange(amount).then((r) => {
//     dispatch({type: WALLET_SEND_CM_LHT_TO_EXCHANGE_END})
//     dispatch(updateCMLHTBalance())
//     if (r) {
//       dispatch(showAlertModal({title: 'Send LHT to Exchange', message: 'Transaction successfully accepted!'}))
//     } else {
//       dispatch(showAlertModal({title: 'ERROR Send LHT to Exchange', message: 'Insufficient funds.'}))
//     }
//   }).catch(() => {
//     dispatch({type: WALLET_SEND_CM_LHT_TO_EXCHANGE_END})
//   })
// }

export const getTransactionsByAccount = (tokens, toBlock) => async (dispatch) => {
  dispatch({type: WALLET_TRANSACTIONS_FETCH})
  const resolvedBlock = toBlock || await Web3Provider.getBlockNumber()
  const fromBlock = Math.max(resolvedBlock - 100, 0)
  const promises = []
  tokens = tokens.valueSeq().toArray()
  for (let token of tokens) {
    promises.push(token.dao().getTransfer(LS.getAccount(), fromBlock, resolvedBlock))
  }
  let map = new Immutable.Map()
  const txs = await Promise.all(promises)
  txs.forEach(tx => {
    map = map.merge(tx)
  })
  dispatch({type: WALLET_TRANSACTIONS, map, toBlock: fromBlock - 1})
}
