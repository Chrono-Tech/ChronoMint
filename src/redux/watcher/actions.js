import AbstractContractDAO, { TxError, txErrorCodes } from '../../dao/AbstractContractDAO'
import ContractsManagerDAO from '../../dao/ContractsManagerDAO'

import TransactionStartNoticeModel from '../../models/notices/TransactionStartNoticeModel'
import TransactionErrorNoticeModel from '../../models/notices/TransactionErrorNoticeModel'
import type TransactionExecModel from '../../models/TransactionExecModel'

import { notify } from '../notifier/actions'
import { watchInitCBE } from '../settings/userManager/cbe'
import { handleNewPoll, handleNewVote } from '../polls/data'
import { watchInitOperations } from '../operations/actions'
import { watchInitWallet } from '../wallet/actions'
import { watchInitLOC } from '../locs/actions'
import { showConfirmTxModal } from '../ui/modal'
import { isConfirm } from '../../network/settings'

// next two actions represents start of the events watching
export const WATCHER = 'watcher/USER'
export const WATCHER_CBE = 'watcher/CBE'

export const WATCHER_TX_START = 'watcher/TX_START'
export const WATCHER_TX_END = 'watcher/TX_END'

// for all logged in users
export const watcher = () => async (dispatch, getState) => {
  dispatch(watchInitWallet())

  AbstractContractDAO.txStart = async (tx: TransactionExecModel, plural: ?Object = null) => {
    const isNeedToConfirm = isConfirm(getState().get('network').selectedProviderId)
    const isConfirmed = isNeedToConfirm ? await dispatch(showConfirmTxModal({tx, plural})) : true
    if (!isConfirmed) {
      throw new TxError('Cancelled by user from custom tx confirmation modal', txErrorCodes.FRONTEND_CANCELLED)
    }
    dispatch(notify(new TransactionStartNoticeModel(), false))
    dispatch({type: WATCHER_TX_START, tx})
  }

  AbstractContractDAO.txEnd = (tx: TransactionExecModel, e: TxError = null) => {
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
