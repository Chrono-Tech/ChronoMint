import AbstractContractDAO, { TxError, TX_FRONTEND_ERROR_CODES } from 'dao/AbstractContractDAO'

import ArbitraryNoticeModel from 'models/notices/ArbitraryNoticeModel'
import TransactionErrorNoticeModel from 'models/notices/TransactionErrorNoticeModel'
import type TxExecModel from 'models/TxExecModel'

import contractsManagerDAO from 'dao/ContractsManagerDAO'

import { notify } from 'redux/notifier/actions'
import { showConfirmTxModal } from 'redux/ui/modal'

import { watchInitCBE } from 'redux/settings/user/cbe/actions'
import { watchInitOperations } from 'redux/operations/actions'
import { watchInitWallet, balanceMinus, balancePlus, ETH } from 'redux/wallet/actions'
import { watchInitLOC } from 'redux/locs/actions'
import { watchInitERC20Tokens } from 'redux/settings/erc20/tokens/actions'
import { handleNewPoll, handleNewVote } from 'redux/polls/data'

// next two actions represents start of the events watching
export const WATCHER = 'watcher/USER'
export const WATCHER_CBE = 'watcher/CBE'

export const WATCHER_TX_SET = 'watcher/TX_SET'
export const WATCHER_TX_END = 'watcher/TX_END'

export const txHandlingFlow = () => (dispatch, getState) => {

  AbstractContractDAO.txStart = async (tx: TxExecModel) => {
    dispatch({type: WATCHER_TX_SET, tx})

    const isConfirmed = await dispatch(showConfirmTxModal())
    if (!isConfirmed) {
      throw new TxError('Cancelled by user from custom tx confirmation modal', TX_FRONTEND_ERROR_CODES.FRONTEND_CANCELLED)
    }

    dispatch(notify(new ArbitraryNoticeModel({ key: 'notices.tx.processing' }), false))
  }

  AbstractContractDAO.txGas = (tx: TxExecModel) => {
    dispatch({type: WATCHER_TX_SET, tx})
  }

  AbstractContractDAO.txRun = (tx: TxExecModel) => {
    const token = getState().get('wallet').tokens.get(ETH)
    dispatch(balanceMinus(tx.gas(), token))
  }

  AbstractContractDAO.txEnd = (tx: TxExecModel, e: ?TxError = null) => {
    dispatch({type: WATCHER_TX_END, tx})

    const token = getState().get('wallet').tokens.get(ETH)

    if (!tx.isGasUsed()) {
      dispatch(balancePlus(tx.gas(), token))
    } else if (tx.estimateGasLaxity().gt(0)) {
      dispatch(balancePlus(tx.estimateGasLaxity(), token))
    }

    if (e && e.codeValue !== TX_FRONTEND_ERROR_CODES.FRONTEND_CANCELLED) {
      dispatch(notify(new TransactionErrorNoticeModel(tx, e)))
    }
  }
}

// for all logged in users
export const watcher = () => async (dispatch) => {
  dispatch(watchInitWallet())
  dispatch(watchInitERC20Tokens())

  dispatch(txHandlingFlow())

  dispatch({type: WATCHER})
}

// only for CBE
export const cbeWatcher = () => async (dispatch) => {
  dispatch({type: WATCHER_CBE})

  // settings
  dispatch(watchInitCBE())

  dispatch(watchInitLOC())

  dispatch(watchInitOperations())

  // voting TODO @bshevchenko: MINT-93 use watchInit* and watch
  const voteDAO = await contractsManagerDAO.getVoteDAO()
  await voteDAO.newPollWatch((index) => dispatch(handleNewPoll(index)))
  await voteDAO.newVoteWatch((index) => dispatch(handleNewVote(index)))
}
