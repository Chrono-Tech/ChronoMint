import { SubmissionError } from 'redux-form'
import LHTProxyDAO from '../../dao/LHTProxyDAO'
import ChronoMintDAO from '../../dao/ChronoMintDAO'
import TokenContractsDAO from '../../dao/TokenContractsDAO'
import TIMEProxyDAO from '../../dao/TIMEProxyDAO'
import TIMEHolderDAO from '../../dao/TIMEHolderDAO'
import TransferNoticeModel from '../../models/notices/TransferNoticeModel'
import TransactionModel from '../../models/TransactionModel'
import { showAlertModal, hideModal } from '../ui/modal'
import { getPolls } from '../polls/data'
import { transactionStart, notify } from '../notifier/notifier'

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

const balanceTIMEFetch = (progress = true) => ({type: WALLET_BALANCE_TIME_FETCH, progress})
const balanceTIME = (balance = null) => ({type: WALLET_BALANCE_TIME, balance})
const balanceLHTFetch = () => ({type: WALLET_BALANCE_LHT_FETCH})
const transaction = (tx: TransactionModel) => ({type: WALLET_TRANSACTION, tx})

const updateTIMEBalance = (account) => (dispatch) => {
  dispatch(balanceTIMEFetch())
  return TIMEProxyDAO.getAccountBalance(account)
    .then(balance => dispatch(balanceTIME(balance)))
}

const updateTIMEDeposit = (account) => (dispatch) => {
  return TIMEHolderDAO.getAccountDepositBalance(account)
    .then(deposit => dispatch({type: WALLET_TIME_DEPOSIT, deposit}))
}

const transferTIME = (account, amount, recipient) => (dispatch) => {
  dispatch(balanceTIMEFetch())
  TIMEProxyDAO.transfer(amount, recipient, account)
    .then(() => dispatch(updateTIMEBalance(account)))
}

const requireTIME = (account) => (dispatch) => {
  dispatch(transactionStart())
  dispatch(balanceTIMEFetch())
  return TokenContractsDAO.requireTIME(account).then((r) => {
    if (r) {
      dispatch(showAlertModal({title: 'Require Time', message: 'Time request executed successfully.'}))
    } else {
      dispatch(showAlertModal({title: 'Error', message: 'Time request not completed.'}))
    }
    return dispatch(updateTIMEBalance(account))
  }).catch(() => {
    dispatch(balanceTIME())
  })
}

const depositTIME = (amount, account) => (dispatch) => {
  dispatch(transactionStart())
  dispatch(balanceTIMEFetch('0%'))
  return TIMEHolderDAO.approveAmount(amount, account).then(() => {
    dispatch(balanceTIMEFetch('50%'))
    return TIMEHolderDAO.depositAmount(amount, account).then((r) => {
      if (r) {
        dispatch(hideModal())
        dispatch(updateTIMEDeposit(account))
        dispatch(getPolls(account))
        return dispatch(updateTIMEBalance(account))
      } else {
        dispatch(updateTIMEBalance(account))
        throw new SubmissionError({amount: 'Insufficient funds', _error: 'Error'})
      }
    })
  }).catch(() => {
    dispatch(balanceTIME())
  })
}

const withdrawTIME = (amount, account) => (dispatch) => {
  dispatch(transactionStart())
  dispatch(balanceTIMEFetch())
  return TIMEHolderDAO.withdrawAmount(amount, account).then((r) => {
    if (r) {
      dispatch(hideModal())
      dispatch(updateTIMEDeposit(account))
      dispatch(updateTIMEBalance(account))
      dispatch(getPolls(account))
    } else {
      dispatch(updateTIMEBalance())
      throw new SubmissionError({amount: 'Insufficient funds', _error: 'Error'})
    }
  }).catch(() => {
    dispatch(balanceTIME())
    dispatch(showAlertModal({title: 'Withdraw Time Error!', message: 'Transaction canceled!'}))
  })
}

const updateLHTBalance = () => (dispatch) => {
  dispatch(balanceLHTFetch())
  LHTProxyDAO.getAccountBalance(window.localStorage.account)
    .then(balance => dispatch({type: WALLET_BALANCE_LHT, balance}))
}

const updateCMLHTBalance = () => (dispatch) => { // CM => ContractsManager
  dispatch({type: WALLET_CM_BALANCE_LHT_FETCH})
  return TokenContractsDAO.getLHTBalance()
    .then(balance => dispatch({type: WALLET_CM_BALANCE_LHT, balance}))
}

const updateETHBalance = (account) => (dispatch) => {
  dispatch({type: WALLET_BALANCE_ETH_FETCH})
  ChronoMintDAO.getAccountETHBalance(account).then(balance => {
    dispatch({type: WALLET_BALANCE_ETH, balance})
  })
}

const transferETH = (account, amount, recipient) => (dispatch) => {
  const txHash = ChronoMintDAO.web3.eth.sendTransaction({
    from: account,
    to: recipient,
    value: ChronoMintDAO.web3.toWei(parseFloat(amount, 10), 'ether')
  }, () => {
    ChronoMintDAO.web3.eth.getBlock('pending', (e, pendingBlock) => {
      pendingBlock.transactions.forEach(tx => {
        if (tx === txHash) {
          const txn = ChronoMintDAO.web3.eth.getTransaction(txHash)
          dispatch(transaction(new TransactionModel({
            txHash: txn.hash,
            nonce: txn.nonce,
            blockHash: txn.blockHash,
            blockNumber: txn.blockNumber,
            transactionIndex: txn.transactionIndex,
            from: txn.from,
            to: txn.to,
            value: txn.value,
            time: pendingBlock.timestamp,
            gasPrice: txn.gasPrice,
            gas: txn.gas,
            input: txn.input,
            credited: false,
            symbol: 'ETH'
          })))
        }
      })
      dispatch(updateETHBalance(account))
    })
  })
}

const transferLHT = (account, amount, recipient) => (dispatch) => {
  dispatch(balanceLHTFetch())
  LHTProxyDAO.transfer(amount, recipient, account)
    .then(() => dispatch(updateLHTBalance()))
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

export {
  balanceTIMEFetch,
  balanceTIME,
  balanceLHTFetch,
  transaction,
  updateTIMEBalance,
  updateTIMEDeposit,
  updateLHTBalance,
  updateETHBalance,
  transferETH,
  transferLHT,
  transferTIME,
  requireTIME,
  depositTIME,
  withdrawTIME,
  getTransactionsByAccount,
  updateCMLHTBalance,
  watchInitTransfer
}
