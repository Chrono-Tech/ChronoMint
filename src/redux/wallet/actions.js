import LHTProxyDAO from '../../dao/LHTProxyDAO'
import ChronoMintDAO from '../../dao/ChronoMintDAO'
import TokenContractsDAO from '../../dao/TokenContractsDAO'
import TIMEProxyDAO from '../../dao/TIMEProxyDAO'
import TIMEHolderDAO from '../../dao/TIMEHolderDAO'
import TransferNoticeModel from '../../models/notices/TransferNoticeModel'
import TransactionModel from '../../models/TransactionModel'
import { showAlertModal, hideModal } from '../ui/modal'
import { notify } from '../notifier/notifier'
import LS from '../../dao/LocalStorageDAO'

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

export const balanceETHFetch = () => ({type: WALLET_BALANCE_ETH_FETCH})
export const balanceTIMEFetch = () => ({type: WALLET_BALANCE_TIME_FETCH})
export const balanceTIME = (balance = null) => ({type: WALLET_BALANCE_TIME, balance})
export const balanceLHTFetch = () => ({type: WALLET_BALANCE_LHT_FETCH})
export const transaction = (tx: TransactionModel) => ({type: WALLET_TRANSACTION, tx})

export const watchTransfer = (notice: TransferNoticeModel, isOld) => (dispatch) => {
  dispatch(notify(notice, isOld))
  if (!isOld) {
    dispatch(transaction(notice.tx()))
  }
}

export const watchInitTransfer = (account) => (dispatch) => {
  const callback = (notice, isOld) => dispatch(watchTransfer(notice, isOld))
  LHTProxyDAO.watchTransfer(callback, account)
  TIMEProxyDAO.watchTransfer(callback, account)
}

export const updateTIMEBalance = () => (dispatch) => {
  dispatch(balanceTIMEFetch())
  return TIMEProxyDAO.getAccountBalance(LS.getAccount())
    .then(balance => dispatch(balanceTIME(balance)))
}

export const updateTIMEDeposit = () => (dispatch) => {
  return TIMEHolderDAO.getAccountDepositBalance(LS.getAccount())
    .then(deposit => dispatch({type: WALLET_TIME_DEPOSIT, deposit}))
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

export const depositTIME = (amount) => (dispatch) => {
  dispatch(hideModal())
  dispatch(balanceTIMEFetch())
  return TIMEHolderDAO.approveAmount(amount).then(() => {
    return TIMEHolderDAO.depositAmount(amount).then((r) => {
      if (r) {
        return Promise.all([
          dispatch(updateTIMEDeposit()),
          dispatch(updateTIMEBalance())
        ])
      } else {
        dispatch(updateTIMEBalance())
        dispatch(showAlertModal({title: 'Deposit TIME error', message: 'Insufficient funds.'}))
      }
    })
  }).catch(() => {
    dispatch(balanceTIME())
  })
}

export const withdrawTIME = (amount) => (dispatch) => {
  dispatch(hideModal())
  dispatch(balanceTIMEFetch())
  return TIMEHolderDAO.withdrawAmount(amount).then((r) => {
    if (r) {
      return Promise.all([
        dispatch(updateTIMEDeposit()),
        dispatch(updateTIMEBalance())
      ])
    } else {
      dispatch(updateTIMEBalance())
      dispatch(showAlertModal({title: 'Withdraw TIME error', message: 'Insufficient funds.'}))
    }
  }).catch(() => {
    dispatch(balanceTIME())
  })
}

export const updateLHTBalance = () => (dispatch) => {
  dispatch(balanceLHTFetch())
  return LHTProxyDAO.getAccountBalance(LS.getAccount())
    .then(balance => dispatch({type: WALLET_BALANCE_LHT, balance}))
}

export const updateETHBalance = () => (dispatch) => {
  dispatch(balanceETHFetch())
  return ChronoMintDAO.getAccountETHBalance(LS.getAccount()).then(balance => {
    dispatch({type: WALLET_BALANCE_ETH, balance})
  })
}

export const updateCMLHTBalance = () => (dispatch) => { // CM => ContractsManager
  dispatch({type: WALLET_CM_BALANCE_LHT_FETCH})
  return TokenContractsDAO.getLHTBalance()
  .then(balance => dispatch({type: WALLET_CM_BALANCE_LHT, balance}))
}

export const transferETH = (amount: string, recipient) => (dispatch) => {
  dispatch(balanceETHFetch())
  return ChronoMintDAO.sendETH(recipient, amount).then(notice => {
    dispatch(watchTransfer(notice, false))
    dispatch(updateETHBalance())
  }).catch(message => {
    dispatch(showAlertModal({title: 'ETH transfer error', message}))
    dispatch(updateETHBalance())
  })
}

export const transferLHT = (amount, recipient) => (dispatch) => {
  dispatch(balanceLHTFetch())
  LHTProxyDAO.transfer(amount, recipient)
    .then(() => dispatch(updateLHTBalance()))
}

export const transferTIME = (amount, recipient) => (dispatch) => {
  dispatch(balanceTIMEFetch())
  return TIMEProxyDAO.transfer(amount, recipient)
    .then(() => dispatch(updateTIMEBalance()))
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

  const callback = (toBlock) => {
    const fromBlock = Math.max(toBlock - 100, 0)
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
