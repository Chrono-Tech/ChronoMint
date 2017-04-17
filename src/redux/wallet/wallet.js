import { SubmissionError } from 'redux-form'
import TimeProxyDAO from '../../dao/TimeProxyDAO'
import LHTProxyDAO from '../../dao/LHTProxyDAO'
import AssetProxyDAO from '../../dao/AssetProxyDAO'
import ChronoMintDAO from '../../dao/ChronoMintDAO'
import TokenContractsDAO from '../../dao/TokenContractsDAO'
import TimeHolderDAO from '../../dao/TimeHolderDAO'
import { showAlertModal, hideModal } from '../ui/modal'
import { getPolls } from '../polls/data'
import { transactionStart } from '../notifier/notifier'
import {
  setTimeBalanceStart,
  setTimeBalanceEnd,
  setTimeBalanceSuccess,
  setTimeDepositSuccess,
  setLHTBalanceStart,
  setLHTBalanceSuccess,
  setETHBalanceStart,
  setETHBalanceSuccess,
  setTransactionStart,
  setTransactionSuccess,
  setContractsManagerLHTBalanceStart,
  setContractsManagerLHTBalanceSuccess
} from './reducer'

const updateTimeBalance = (account) => (dispatch) => {
  dispatch(setTimeBalanceStart())
  return TimeProxyDAO.getAccountBalance(account)
    .then(balance => dispatch(setTimeBalanceSuccess(balance)))
}

const updateTimeDeposit = (account) => (dispatch) => {
  return TimeHolderDAO.getAccountDepositBalance(account)
    .then(balance => dispatch(setTimeDepositSuccess(balance)))
}

const updateLHTBalance = () => (dispatch) => {
  dispatch(setLHTBalanceStart())
  LHTProxyDAO.getAccountBalance(window.localStorage.getItem('chronoBankAccount'))
    .then(balance => {
      dispatch(setLHTBalanceSuccess(balance))
    })
}

const updateContractsManagerLHTBalance = () => (dispatch) => {
  dispatch(setContractsManagerLHTBalanceStart())
  return TokenContractsDAO.getLhtBalance()
    .then(balance => {
      dispatch(setContractsManagerLHTBalanceSuccess(balance))
    })
}

const updateETHBalance = () => (dispatch) => {
  dispatch(setETHBalanceStart())
  TimeProxyDAO.web3.fromWei(TimeProxyDAO.web3.eth.getBalance(window.localStorage.chronoBankAccount, (e, r) => {
    dispatch(setETHBalanceSuccess(r.toNumber()))
  }))
}

const transferEth = (amount, recipient) => (dispatch) => {
  const txHash = LHTProxyDAO.web3.eth.sendTransaction({
    from: window.localStorage.chronoBankAccount,
    to: recipient,
    value: LHTProxyDAO.web3.toWei(parseFloat(amount, 10), 'ether')
  }, () => {
    LHTProxyDAO.web3.eth.getBlock('pending', (e, pendingBlock) => {
      pendingBlock.transactions.forEach(tx => {
        if (tx === txHash) {
          const txn = LHTProxyDAO.web3.eth.getTransaction(txHash)
          dispatch(setTransactionSuccess({
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
          }))
        }
      })

      dispatch(updateETHBalance())
    })
  })
}

const transferLht = (amount, recipient) => (dispatch) => {
  dispatch(setLHTBalanceStart())
  LHTProxyDAO.transfer(amount, recipient, window.localStorage.getItem('chronoBankAccount'))
    .then(() => dispatch(updateLHTBalance()))
}

const transferTime = (amount, recipient, account) => (dispatch) => {
  dispatch(setTimeBalanceStart())
  TimeProxyDAO.transfer(amount, recipient, account)
    .then(() => dispatch(updateTimeBalance(account)))
}

const requireTime = (account) => (dispatch) => {
  dispatch(transactionStart())
  dispatch(setTimeBalanceStart())
  return TokenContractsDAO.requireTime(account).then((r) => {
    if (r) {
      dispatch(showAlertModal({title: 'Require Time', message: 'Time request executed successfully.'}))
    } else {
      dispatch(showAlertModal({title: 'Error', message: 'Time request not completed.'}))
    }
    return dispatch(updateTimeBalance(account))
  }).catch(() => {
    dispatch(setTimeBalanceEnd())
    dispatch(showAlertModal({title: 'Require Time Error!', message: 'Transaction canceled!'}))
  })
}

const depositTime = (amount, account) => (dispatch) => {
  dispatch(transactionStart())
  dispatch(setTimeBalanceStart('0%'))
  return TimeHolderDAO.approveAmount(amount, account).then(() => {
    dispatch(setTimeBalanceStart('50%'))
    return TimeHolderDAO.depositAmount(amount, account).then((r) => {
      if (r) {
        dispatch(hideModal())
        dispatch(updateTimeDeposit(account))
        dispatch(getPolls(account))
        return dispatch(updateTimeBalance(account))
      } else {
        dispatch(updateTimeBalance(account))
        throw new SubmissionError({amount: 'Insufficient funds', _error: 'Error'})
      }
    })
  }).catch(() => {
    dispatch(setTimeBalanceEnd())
    dispatch(showAlertModal({title: 'Deposit Time Error!', message: 'Transaction canceled!'}))
  })
}

const withdrawTime = (amount, account) => (dispatch) => {
  dispatch(transactionStart())
  dispatch(setTimeBalanceStart())
  return TimeHolderDAO.withdrawAmount(amount, account).then((r) => {
    if (r) {
      dispatch(hideModal())
      dispatch(updateTimeDeposit(account))
      dispatch(updateTimeBalance(account))
      dispatch(getPolls(account))
    } else {
      dispatch(updateTimeBalance())
      throw new SubmissionError({amount: 'Insufficient funds', _error: 'Error'})
    }
  }).catch(() => {
    dispatch(setTimeBalanceEnd())
    dispatch(showAlertModal({title: 'Withdraw Time Error!', message: 'Transaction canceled!'}))
  })
}

const getTransactionsByAccount = (account, transactionsCount, endBlock) => (dispatch) => {
  dispatch(setTransactionStart())
  function scanTransactionCallback (txn, block) {
    if ((txn.to === account || txn.from === account) && txn.value > 0) {
      dispatch(setTransactionSuccess({
        txHash: txn.hash,
        nonce: txn.nonce,
        blockHash: txn.blockHash,
        blockNumber: txn.blockNumber,
        transactionIndex: txn.transactionIndex,
        from: txn.from,
        to: txn.to,
        value: txn.value,
        time: block.timestamp,
        gasPrice: txn.gasPrice,
        gas: txn.gas,
        input: txn.input,
        credited: txn.to === account,
        symbol: 'ETH'
      }))
    }
  }

  function scanTransferCallback (e, r) {
    if (r.length > 0) {
      const AssetProxy = new AssetProxyDAO(r[0].address)
      AssetProxy.getSymbol().then(symbol => {
        r.forEach(txn => {
          if ((txn.args.to === account || txn.args.from === account) && txn.args.value > 0) {
            ChronoMintDAO.web3.eth.getBlock(txn.blockHash, (e, block) => {
              dispatch(setTransactionSuccess({
                txHash: txn.transactionHash,
                blockHash: txn.blockHash,
                blockNumber: txn.blockNumber,
                transactionIndex: txn.transactionIndex,
                from: txn.args.from,
                to: txn.args.to,
                value: txn.args.value,
                time: block.timestamp,
                credited: txn.args.to === account,
                symbol
              }))
            })
          }
        })
      })
    }
  }

  function watchTransferCallback (e, txn) {
    console.log(txn)
    const AssetProxy = new AssetProxyDAO(txn.address)
    AssetProxy.getSymbol().then(symbol => {
      if ((txn.args.to === account || txn.args.from === account) && txn.args.value > 0) {
        ChronoMintDAO.web3.eth.getBlock(txn.blockHash, (e, block) => {
          dispatch(setTransactionSuccess({
            txHash: txn.transactionHash,
            blockHash: txn.blockHash,
            blockNumber: txn.blockNumber,
            transactionIndex: txn.transactionIndex,
            from: txn.args.from,
            to: txn.args.to,
            value: txn.args.value,
            time: block.timestamp,
            credited: txn.args.to === account,
            symbol
          }))
        })
      }
    })
  }

  const callback = (endBlock) => {
    ChronoMintDAO.scanBlockRange(transactionsCount, null, endBlock, scanTransactionCallback)
    const toBlock = endBlock

    TimeProxyDAO.getTransfer(scanTransferCallback, {
      fromBlock: toBlock - transactionsCount < 0 ? 0 : toBlock - transactionsCount,
      toBlock
    })

    LHTProxyDAO.getTransfer(scanTransferCallback, {
      fromBlock: toBlock - transactionsCount < 0 ? 0 : toBlock - transactionsCount,
      toBlock
    })

    LHTProxyDAO.watchTransfer(watchTransferCallback) // TODO move to userWatcher
    TimeProxyDAO.watchTransfer(watchTransferCallback)
  }

  if (!endBlock) {
    ChronoMintDAO.web3.eth.getBlockNumber((e, r) => {
      callback(r)
    })
  } else {
    callback(endBlock)
  }
}

export {
  updateTimeBalance,
  updateTimeDeposit,
  updateLHTBalance,
  updateETHBalance,
  transferEth,
  transferLht,
  transferTime,
  requireTime,
  depositTime,
  withdrawTime,
  getTransactionsByAccount,
  updateContractsManagerLHTBalance
}
