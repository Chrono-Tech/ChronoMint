import { Map } from 'immutable'
import AbstractContractDAO from '../dao/AbstractContractDAO'
import ContractsManagerDAO from '../dao/ContractsManagerDAO'
import TransactionExecModel from '../models/TransactionExecModel'
import { transactionStart } from './notifier/notifier'
import { watchInitCBE } from './settings/userManager/cbe'
import { handleNewPoll, handleNewVote } from './polls/data'
import { watchInitOperations } from './operations/actions'
import { watchInitWallet } from './wallet/actions'
import { watchInitLOC } from './locs/actions'

// next two actions represents start of the events watching
export const WATCHER = 'watcher/USER'
export const WATCHER_CBE = 'watcher/CBE'

export const WATCHER_TX_START = 'watcher/TX_START'
export const WATCHER_TX_GAS = 'watcher/TX_GAS'
export const WATCHER_TX_END = 'watcher/TX_END'

const initialState = {
  pendingTxs: new Map()
}

export default (state = initialState, action) => {
  switch (action.type) {
    case WATCHER_TX_START:
    case WATCHER_TX_GAS:
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

export const watcher = () => async (dispatch) => { // for all logged in users
  dispatch(watchInitWallet())

  AbstractContractDAO.txStart = (tx: TransactionExecModel) => {
    dispatch(transactionStart())
    dispatch({type: WATCHER_TX_START, tx})
  }
  AbstractContractDAO.txGas = (tx: TransactionExecModel) => {
    dispatch({type: WATCHER_TX_GAS, tx})
  }
  AbstractContractDAO.txEnd = (tx: TransactionExecModel, e: Error = null) => {
    dispatch({type: WATCHER_TX_END, tx})
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
