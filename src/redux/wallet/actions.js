import LHTProxyDAO from '../../dao/LHTProxyDAO'
import { reset } from 'redux-form'
import EthereumDAO from '../../dao/EthereumDAO'
import TokenContractsDAO from '../../dao/TokenContractsDAO'
import DAORegistry from '../../dao/DAORegistry'
import TransferNoticeModel from '../../models/notices/TransferNoticeModel'
import { showAlertModal, hideModal } from '../ui/modal'
import { notify } from '../notifier/notifier'
import LS from '../../utils/LocalStorage'
import web3Provider from '../../network/Web3Provider'
import { exchangeTransaction } from '../exchange/actions'

export const WALLET_TOKENS_FETCH = 'wallet/TOKENS_FETCH'
export const WALLET_TOKENS = 'wallet/TOKENS'
export const WALLET_BALANCE_TIME_FETCH = 'wallet/BALANCE_TIME_FETCH'
export const WALLET_BALANCE_TIME = 'wallet/BALANCE_TIME'
export const WALLET_TIME_DEPOSIT = 'wallet/TIME_DEPOSIT'
export const WALLET_BALANCE_LHT_FETCH = 'wallet/BALANCE_LHT_FETCH'
export const WALLET_BALANCE_LHT = 'wallet/BALANCE_LHT'
export const WALLET_BALANCE_ETH_FETCH = 'wallet/BALANCE_ETH_FETCH'
export const WALLET_BALANCE_ETH = 'wallet/BALANCE_ETH'
export const WALLET_TRANSACTIONS_FETCH = 'wallet/TRANSACTIONS_FETCH'
export const WALLET_TRANSACTION = 'wallet/TRANSACTION'
export const WALLET_TRANSACTIONS = 'wallet/TRANSACTIONS'
export const WALLET_CM_BALANCE_LHT_FETCH = 'wallet/CM_BALANCE_LHT_FETCH'
export const WALLET_CM_BALANCE_LHT = 'wallet/CM_BALANCE_LHT'
// TODO Move this two actions
export const WALLET_SEND_CM_LHT_TO_EXCHANGE_FETCH = 'wallet/SEND_CM_LHT_TO_EXCHANGE_FETCH'
// TODO ...to LOCs duck
export const WALLET_SEND_CM_LHT_TO_EXCHANGE_END = 'wallet/SEND_CM_LHT_TO_EXCHANGE_END'

export const balanceETHFetch = () => ({type: WALLET_BALANCE_ETH_FETCH})
export const balanceTIMEFetch = () => ({type: WALLET_BALANCE_TIME_FETCH})
export const balanceTIME = (balance = null) => ({type: WALLET_BALANCE_TIME, balance})
export const balanceLHTFetch = () => ({type: WALLET_BALANCE_LHT_FETCH})

export const watchTransfer = (notice: TransferNoticeModel, isOld) => (dispatch) => {
  dispatch(notify(notice, isOld))
  if (!isOld) {
    const tx = notice.tx()
    dispatch({type: WALLET_TRANSACTION, tx})
    dispatch(exchangeTransaction(tx))
  }
}

export const watchInitWallet = () => async (dispatch) => {
  const callback = (notice, isOld) => dispatch(watchTransfer(notice, isOld))

  dispatch({type: WALLET_TOKENS_FETCH})
  const dao = await DAORegistry.getERC20ManagerDAO()
  const tokens = await dao.getTokens()
  dispatch({type: WALLET_TOKENS, tokens})

  for (let token of tokens) {
    token.watchTransfer(callback)
  }
}

export const updateTIMEBalance = () => async (dispatch) => {
  dispatch(balanceTIMEFetch())
  const dao = await DAORegistry.getTIMEDAO()
  const balance = await dao.getAccountBalance(LS.getAccount())
  dispatch(balanceTIME(balance))
}

export const updateTIMEDeposit = () => async (dispatch) => {
  const dao = await DAORegistry.getTIMEHolderDAO()
  const deposit = await dao.getAccountDepositBalance(LS.getAccount())
  dispatch({type: WALLET_TIME_DEPOSIT, deposit})
}

export const requireTIME = () => (dispatch) => {
  dispatch(hideModal())
  dispatch(balanceTIMEFetch())
  return TokenContractsDAO.requireTIME().then(() => {
    return dispatch(updateTIMEBalance())
  }).catch(() => {
    dispatch(balanceTIME())
  })
}

export const depositTIME = (amount) => async (dispatch) => {
  dispatch(hideModal())
  dispatch(balanceTIMEFetch())
  try {
    const dao = await DAORegistry.getTIMEHolderDAO()
    if (await dao.deposit(amount)) {
      await dispatch(updateTIMEDeposit)
      await dispatch(updateTIMEBalance)
    } else {
      dispatch(updateTIMEBalance())
      dispatch(showAlertModal({title: 'Deposit TIME error', message: 'Insufficient funds.'}))
    }
  } catch (e) {
    dispatch(balanceTIME())
  }
}

export const withdrawTIME = (amount) => async (dispatch) => {
  dispatch(hideModal())
  dispatch(balanceTIMEFetch())
  try {
    const dao = await DAORegistry.getTIMEHolderDAO()
    if (await dao.withdraw(amount)) {
      await dispatch(updateTIMEDeposit())
      await dispatch(updateTIMEBalance())
    } else {
      dispatch(updateTIMEBalance())
      dispatch(showAlertModal({title: 'Withdraw TIME error', message: 'Insufficient funds.'}))
    }
  } catch (e) {
    dispatch(balanceTIME())
  }
}

export const updateLHTBalance = () => (dispatch) => {
  dispatch(balanceLHTFetch())
  return LHTProxyDAO.getAccountBalance(LS.getAccount())
    .then(balance => dispatch({type: WALLET_BALANCE_LHT, balance}))
}

export const updateETHBalance = () => (dispatch) => {
  dispatch(balanceETHFetch())
  return EthereumDAO.getAccountETHBalance(LS.getAccount()).then(balance => {
    dispatch({type: WALLET_BALANCE_ETH, balance})
  })
}

export const updateCMLHTBalance = () => (dispatch) => { // CM => ContractsManager
  dispatch({type: WALLET_CM_BALANCE_LHT_FETCH})
  return TokenContractsDAO.getLHTBalance()
    .then(balance => dispatch({type: WALLET_CM_BALANCE_LHT, balance}))
}

export const transfer = (currency: string, amount: string, recipient) => (dispatch, getState) => {
  if (currency === 'eth') {
    return dispatch(transferETH(amount, recipient))
  }
  const tokens = getState().get('wallet').tokens
  for (let token of tokens) {
    if (token.getSymbol() === currency) {
      token.transfer(amount, recipient)
    }
  }
}

export const transferETH = (amount: string, recipient) => (dispatch) => {
  dispatch(balanceETHFetch())
  return EthereumDAO.sendETH(recipient, amount).then(notice => {
    dispatch(watchTransfer(notice, false))
    dispatch(updateETHBalance())
  }).catch(e => {
    dispatch(showAlertModal({title: 'ETH transfer error', message: e.message}))
    dispatch(updateETHBalance())
  })
}

export const resetSendForm = () => dispatch => {
  dispatch(reset('sendForm'))
}

export const transferLHT = (amount, recipient) => (dispatch) => {
  dispatch(balanceLHTFetch())
  LHTProxyDAO.transfer(amount, recipient)
    .then(() => dispatch(updateLHTBalance()))
}

export const transferTIME = (amount, recipient) => async (dispatch) => {
  dispatch(balanceTIMEFetch())
  const dao = await DAORegistry.getTIMEDAO()
  await dao.transfer(amount, recipient)
  dispatch(updateTIMEBalance())
}

export const sendLHToExchange = (amount) => (dispatch) => {
  dispatch(hideModal())
  dispatch({type: WALLET_SEND_CM_LHT_TO_EXCHANGE_FETCH})
  return TokenContractsDAO.sendLHTToExchange(amount).then((r) => {
    dispatch({type: WALLET_SEND_CM_LHT_TO_EXCHANGE_END})
    dispatch(updateCMLHTBalance())
    if (r) {
      dispatch(showAlertModal({title: 'Send LHT to Exchange', message: 'Transaction successfully accepted!'}))
    } else {
      dispatch(showAlertModal({title: 'ERROR Send LHT to Exchange', message: 'Insufficient funds.'}))
    }
  }).catch(() => {
    dispatch({type: WALLET_SEND_CM_LHT_TO_EXCHANGE_END})
  })
}

export const getTransactionsByAccount = (account, toBlock) => (dispatch) => {
  dispatch({type: WALLET_TRANSACTIONS_FETCH})
  return new Promise(resolve => {
    if (toBlock) {
      resolve(toBlock)
    } else {
      resolve(web3Provider.getBlockNumber())
    }
  }).then(async (resolvedBlock) => {
    const fromBlock = Math.max(resolvedBlock - 100, 0)
    const timeDAO = await DAORegistry.getTIMEDAO()
    return Promise.all([
      EthereumDAO.getAccountETHTxs(account, fromBlock, resolvedBlock),
      timeDAO.getTransfer(account, fromBlock, resolvedBlock),
      LHTProxyDAO.getTransfer(account, fromBlock, resolvedBlock)
    ]).then(([accountTx, timeTx, lhtTx]) => {
      dispatch({
        type: WALLET_TRANSACTIONS,
        map: accountTx.merge(timeTx).merge(lhtTx),
        toBlock: fromBlock - 1
      })
    })
  })
}
