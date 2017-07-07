import AbstractContractDAO, { TxError, txErrorCodes } from 'dao/AbstractContractDAO'
import ContractsManagerDAO from 'dao/ContractsManagerDAO'

import TransactionStartNoticeModel from 'models/notices/TransactionStartNoticeModel'
import TransactionErrorNoticeModel from 'models/notices/TransactionErrorNoticeModel'
import type TxExecModel from 'models/TxExecModel'

import { notify } from 'redux/notifier/actions'
import { watchInitCBE } from 'redux/settings/user/cbe/actions'
import { handleNewPoll, handleNewVote } from 'redux/polls/data'
import { watchInitOperations } from 'redux/operations/actions'
import { watchInitWallet } from 'redux/wallet/actions'
import { watchInitLOC } from 'redux/locs/actions'
import { showConfirmTxModal } from 'redux/ui/modal'

// next two actions represents start of the events watching
export const WATCHER = 'watcher/USER'
export const WATCHER_CBE = 'watcher/CBE'

export const WATCHER_TX_SET = 'watcher/TX_UPDATE'
export const WATCHER_TX_END = 'watcher/TX_END'

// for all logged in users
export const watcher = () => async (dispatch) => {
  dispatch(watchInitWallet())

  AbstractContractDAO.txStart = async (tx: TxExecModel) => {
    dispatch({type: WATCHER_TX_SET, tx})

    const isConfirmed = await dispatch(showConfirmTxModal())
    if (!isConfirmed) {
      throw new TxError('Cancelled by user from custom tx confirmation modal', txErrorCodes.FRONTEND_CANCELLED)
    }

    dispatch(notify(new TransactionStartNoticeModel(), false))
  }

  AbstractContractDAO.txUpdate = (tx: TxExecModel) => {
    dispatch({type: WATCHER_TX_SET, tx})
  }

  AbstractContractDAO.txEnd = (tx: TxExecModel, e: ?TxError = null) => {
    dispatch({type: WATCHER_TX_END, tx})
    if (e && e.codeValue !== txErrorCodes.FRONTEND_CANCELLED) {
      dispatch(notify(new TransactionErrorNoticeModel(tx, e)))
    }
  }

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
  const voteDAO = await ContractsManagerDAO.getVoteDAO()
  await voteDAO.newPollWatch((index) => dispatch(handleNewPoll(index)))
  await voteDAO.newVoteWatch((index) => dispatch(handleNewVote(index)))
}
