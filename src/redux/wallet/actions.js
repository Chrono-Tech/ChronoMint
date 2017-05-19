import LHTProxyDAO from '../../dao/LHTProxyDAO'
import { reset } from 'redux-form'
import ChronoMintDAO from '../../dao/ChronoMintDAO'
import TokenContractsDAO from '../../dao/TokenContractsDAO'
import TIMEProxyDAO from '../../dao/TIMEProxyDAO'
import TIMEHolderDAO from '../../dao/TIMEHolderDAO'
import TransferNoticeModel from '../../models/notices/TransferNoticeModel'
import { showAlertModal, hideModal } from '../ui/modal'
import { notify } from '../notifier/notifier'
import LS from '../../utils/LocalStorage'
import web3Provider from '../../network/Web3Provider'
import { exchangeTransaction } from '../exchange/actions'
import {
  WALLET_BALANCE_ETH,
  WALLET_BALANCE_ETH_FETCH,
  WALLET_BALANCE_LHT,
  WALLET_BALANCE_LHT_FETCH,
  WALLET_BALANCE_TIME,
  WALLET_BALANCE_TIME_FETCH,
  WALLET_CM_BALANCE_LHT,
  WALLET_CM_BALANCE_LHT_FETCH,
  WALLET_SEND_CM_LHT_TO_EXCHANGE_END,
  WALLET_SEND_CM_LHT_TO_EXCHANGE_FETCH,
  WALLET_TIME_DEPOSIT,
  WALLET_TRANSACTION,
  WALLET_TRANSACTIONS,
  WALLET_TRANSACTIONS_FETCH
} from './reducer'

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

export const watchInitWallet = () => (dispatch) => {
  const callback = (notice, isOld) => dispatch(watchTransfer(notice, isOld))
  LHTProxyDAO.watchTransfer(callback)
  TIMEProxyDAO.watchTransfer(callback)
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
    return TIMEHolderDAO.depositAmount(amount).then(r => {
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
  return TIMEHolderDAO.withdrawAmount(amount).then(r => {
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
  return new Promise(resolve => {
    if (toBlock) {
      resolve(toBlock)
    } else {
      resolve(web3Provider.getBlockNumber())
    }
  }).then(resolvedBlock => {
    const fromBlock = Math.max(resolvedBlock - 100, 0)
    return Promise.all([
      ChronoMintDAO.getAccountETHTxs(account, fromBlock, resolvedBlock),
      TIMEProxyDAO.getTransfer(account, fromBlock, resolvedBlock),
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
