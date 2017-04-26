import LHTProxyDAO from '../../dao/LHTProxyDAO'
import ChronoMintDAO from '../../dao/ChronoMintDAO'
import TokenContractsDAO from '../../dao/TokenContractsDAO'
import TIMEProxyDAO from '../../dao/TIMEProxyDAO'
import TIMEHolderDAO from '../../dao/TIMEHolderDAO'
import TransferNoticeModel from '../../models/notices/TransferNoticeModel'
import TransactionModel from '../../models/TransactionModel'
import { showAlertModal, hideModal } from '../ui/modal'
import { transactionStart, notify } from '../notifier/notifier'
import ls from '../../utils/localStorage'
import localStorageKeys from '../../constants/localStorageKeys'

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
export const WALLET_SEND_CM_LHT_TO_EXCHANGE_FETCH = 'wallet/SEND_CM_LHT_TO_EXCHANGE_FETCH' // TODO Move this two actions
export const WALLET_SEND_CM_LHT_TO_EXCHANGE_END = 'wallet/SEND_CM_LHT_TO_EXCHANGE_END' // TODO ...to LOCs duck

const balanceETHFetch = () => ({type: WALLET_BALANCE_ETH_FETCH})
const balanceTIMEFetch = () => ({type: WALLET_BALANCE_TIME_FETCH})
const balanceTIME = (balance = null) => ({type: WALLET_BALANCE_TIME, balance})
const balanceLHTFetch = () => ({type: WALLET_BALANCE_LHT_FETCH})
const transaction = (tx: TransactionModel) => ({type: WALLET_TRANSACTION, tx})

const watchTransfer = (notice: TransferNoticeModel, isOld) => (dispatch) => {
  dispatch(notify(notice, isOld))
  if (!isOld) {
    dispatch(transaction(notice.tx()))
  }
}

const watchInitTransfer = (account) => (dispatch) => {
  const callback = (notice, isOld) => dispatch(watchTransfer(notice, isOld))
  LHTProxyDAO.watchTransfer(callback, account)
  TIMEProxyDAO.watchTransfer(callback, account)
}

const updateTIMEBalance = (account) => (dispatch) => {
  dispatch(balanceTIMEFetch())
  return TIMEProxyDAO.getAccountBalance(account)
    .then(balance => dispatch(balanceTIME(balance)))
}

const updateTIMEDeposit = (account) => (dispatch) => {
  return TIMEHolderDAO.getAccountDepositBalance(account)
    .then(deposit => dispatch({type: WALLET_TIME_DEPOSIT, deposit}))
}

const requireTIME = (account) => (dispatch) => {
  dispatch(transactionStart())
  dispatch(hideModal())
  dispatch(balanceTIMEFetch())
  return TokenContractsDAO.requireTIME(account).then(() => {
    return dispatch(updateTIMEBalance(account))
  }).catch(() => {
    dispatch(balanceTIME())
  })
}

const depositTIME = (amount, account) => (dispatch) => {
  dispatch(transactionStart())
  dispatch(hideModal())
  dispatch(balanceTIMEFetch())
  return TIMEHolderDAO.approveAmount(amount, account).then(() => {
    return TIMEHolderDAO.depositAmount(amount, account).then((r) => {
      if (r) {
        return Promise.all([
          dispatch(updateTIMEDeposit(account)),
          dispatch(updateTIMEBalance(account))
        ])
      } else {
        dispatch(updateTIMEBalance(account))
        dispatch(showAlertModal({title: 'Deposit TIME error', message: 'Insufficient funds.'}))
      }
    })
  }).catch(() => {
    dispatch(balanceTIME())
  })
}

const withdrawTIME = (amount, account) => (dispatch) => {
  dispatch(transactionStart())
  dispatch(hideModal())
  dispatch(balanceTIMEFetch())
  return TIMEHolderDAO.withdrawAmount(amount, account).then((r) => {
    if (r) {
      return Promise.all([
        dispatch(updateTIMEDeposit(account)),
        dispatch(updateTIMEBalance(account))
      ])
    } else {
      dispatch(updateTIMEBalance())
      dispatch(showAlertModal({title: 'Withdraw TIME error', message: 'Insufficient funds.'}))
    }
  }).catch(() => {
    dispatch(balanceTIME())
  })
}

const updateLHTBalance = () => (dispatch) => {
  dispatch(balanceLHTFetch())
  return LHTProxyDAO.getAccountBalance(ls(localStorageKeys.ACCOUNT))
    .then(balance => dispatch({type: WALLET_BALANCE_LHT, balance}))
}

const updateETHBalance = (account) => (dispatch) => {
  dispatch(balanceETHFetch())
  return ChronoMintDAO.getAccountETHBalance(account).then(balance => {
    dispatch({type: WALLET_BALANCE_ETH, balance})
  })
}

const updateCMLHTBalance = () => (dispatch) => { // CM => ContractsManager
  dispatch({type: WALLET_CM_BALANCE_LHT_FETCH})
  return TokenContractsDAO.getLHTBalance()
  .then(balance => dispatch({type: WALLET_CM_BALANCE_LHT, balance}))
}

const transferETH = (account, amount: string, recipient) => (dispatch) => {
  dispatch(transactionStart())
  dispatch(balanceETHFetch())
  return ChronoMintDAO.sendETH(account, recipient, amount).then(notice => {
    dispatch(watchTransfer(notice, false))
    dispatch(updateETHBalance(account))
  }).catch(message => {
    dispatch(showAlertModal({title: 'ETH transfer error', message}))
    dispatch(updateETHBalance(account))
  })
}

const transferLHT = (account, amount, recipient) => (dispatch) => {
  dispatch(transactionStart())
  dispatch(balanceLHTFetch())
  LHTProxyDAO.transfer(amount, recipient, account)
    .then(() => dispatch(updateLHTBalance()))
}

const transferTIME = (account, amount, recipient) => (dispatch) => {
  dispatch(transactionStart())
  dispatch(balanceTIMEFetch())
  return TIMEProxyDAO.transfer(amount, recipient, account)
  .then(() => dispatch(updateTIMEBalance(account)))
}

const sendLHToExchange = (data) => (dispatch) => {
  dispatch(transactionStart())
  dispatch(hideModal())
  dispatch({type: WALLET_SEND_CM_LHT_TO_EXCHANGE_FETCH})
  const {account, sendAmount} = data
  return TokenContractsDAO.sendLHTToExchange(sendAmount, account).then((r) => {
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

const getTransactionsByAccount = (account, toBlock) => (dispatch) => {
  dispatch({type: WALLET_TRANSACTIONS_FETCH})

  const callback = (toBlock) => {
    const fromBlock = toBlock - 100 < 0 ? 0 : toBlock - 100
    Promise.all([
      ChronoMintDAO.getAccountETHTxs(account, fromBlock, toBlock),
      TIMEProxyDAO.getTransfer(account, fromBlock, toBlock),
      LHTProxyDAO.getTransfer(account, fromBlock, toBlock)
    ]).then(values => {
      dispatch({type: WALLET_TRANSACTIONS, map: values[0].merge(values[1]).merge(values[2]), toBlock: fromBlock - 1})
    })
  }

  if (!toBlock) {
    ChronoMintDAO.web3.eth.getBlockNumber((e, r) => {
      callback(e ? 0 : r)
    })
  } else {
    callback(toBlock)
  }
}

export {
  balanceTIMEFetch,
  balanceTIME,
  balanceLHTFetch,
  transaction,
  updateTIMEBalance,
  updateTIMEDeposit,
  updateLHTBalance,
  updateETHBalance,
  updateCMLHTBalance,
  transferETH,
  transferLHT,
  transferTIME,
  requireTIME,
  depositTIME,
  withdrawTIME,
  getTransactionsByAccount,
  sendLHToExchange,
  watchTransfer,
  watchInitTransfer
}
