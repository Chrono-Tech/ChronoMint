import Immutable from 'immutable'

import AbstractContractDAO, { TxError } from '../dao/AbstractContractDAO'
import ContractsManagerDAO from '../dao/ContractsManagerDAO'
import errorCodes from '../dao/errorCodes'

import TransactionExecModel from '../models/TransactionExecModel'

import { transactionStart } from './notifier/notifier'
import { watchInitCBE } from './settings/userManager/cbe'
import { handleNewPoll, handleNewVote } from './polls/data'
import { watchInitOperations } from './operations/actions'
import { watchInitWallet } from './wallet/actions'
import { watchInitLOC } from './locs/actions'
import { showConfirmTxModal } from './ui/modal'
import { providerMap } from '../network/settings'

// next two actions represents start of the events watching
export const WATCHER = 'watcher/USER'
export const WATCHER_CBE = 'watcher/CBE'

export const WATCHER_TX_START = 'watcher/TX_START'
export const WATCHER_TX_END = 'watcher/TX_END'

const initialState = {
  pendingTxs: new Immutable.Map()
}

export default (state = initialState, action) => {
  switch (action.type) {
    case WATCHER_TX_START:
      return {
        ...state,
        pendingTxs: state.pendingTxs.set(action.tx.id(), action.tx)
      }
    case WATCHER_TX_END:
      return {
        ...state,
        pendingTxs: state.pendingTxs.remove(action.tx.id())
      }
    default:
      return state
  }
}

// for all logged in users
export const watcher = () => async (dispatch, getState) => {
  dispatch(watchInitWallet())

  AbstractContractDAO.txStart = async (tx: TransactionExecModel) => {
    // switch it for tests in testrpc
    // const isInfura = true
    const isInfura = getState().get('network').selectedProviderId === providerMap.infura.id
    const isConfirmed = isInfura ? await dispatch(showConfirmTxModal({tx})) : true
    if (!isConfirmed) {
      throw new TxError('Cancelled by user', errorCodes.FRONTEND_CANCELLED)
    }

    dispatch(transactionStart())
    dispatch({type: WATCHER_TX_START, tx})
    return isConfirmed
  }
  AbstractContractDAO.txEnd = (tx: TransactionExecModel, e: Error = null) => {
    dispatch({type: WATCHER_TX_END, tx})
    // TODO @dkchv: handle error ?
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

  // voting TODO MINT-93 use watchInit* and watch
  const voteDAO = await ContractsManagerDAO.getVoteDAO()
  await voteDAO.newPollWatch((index) => dispatch(handleNewPoll(index)))
  await voteDAO.newVoteWatch((index) => dispatch(handleNewVote(index)))
}
