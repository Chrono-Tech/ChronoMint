import { Map } from 'immutable'
import AbstractContractDAO from '../dao/AbstractContractDAO'
import LOCsManagerDAO from '../dao/LOCsManagerDAO'
import VoteDAO from '../dao/VoteDAO'
import TransactionExecModel from '../models/TransactionExecModel'
import { transactionStart } from './notifier/notifier'
import { showAlertModal } from './ui/modal'
import { handleNewLOC, handleRemoveLOC, handleUpdateLOCValue } from './locs/list/actions'
import {
  watchInitNewLOCNotify,
  watchInitRemoveLOCNotify,
  watchInitUpdLOCStatusNotify,
  watchInitUpdLOCValueNotify,
  watchInitUpdLOCStringNotify
} from './notifier/watchers' // TODO Move out this action creators to LOC duck
import { watchInitWallet } from './wallet/actions'
import { watchInitCBE } from './settings/cbe'
import { watchInitToken } from './settings/tokens'
import { watchInitRewards } from './rewards/rewards'
import { watchInitContract as watchInitOtherContract } from './settings/otherContracts'
import { handleNewPoll, handleNewVote } from './polls/data'
import { watchInitOperations } from './operations/actions'

// next two actions represents start of the events watching
export const WATCHER = 'watcher'
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

export const watcher = () => (dispatch) => { // for all logged in users
  AbstractContractDAO.txStart = (tx: TransactionExecModel) => {
    dispatch(transactionStart())
    dispatch({type: WATCHER_TX_START, tx})
  }
  AbstractContractDAO.txGas = (tx: TransactionExecModel) => {
    dispatch({type: WATCHER_TX_GAS, tx})
  }
  AbstractContractDAO.txEnd = (tx: TransactionExecModel, e: Error = null) => {
    if (e) {
      dispatch(showAlertModal({title: 'Transaction error', message: e.message, isNotI18n: true}))
    }
    dispatch({type: WATCHER_TX_END, tx})
  }

  dispatch(watchInitWallet())
  dispatch(watchInitRewards())

  dispatch({type: WATCHER})
}

// only for CBE
export const cbeWatcher = () => (dispatch) => {
  // settings
  dispatch(watchInitCBE())
  dispatch(watchInitToken())
  dispatch(watchInitOtherContract())

  dispatch(watchInitOperations())

  // LOC
  dispatch(watchInitNewLOCNotify())
  dispatch(watchInitRemoveLOCNotify())
  dispatch(watchInitUpdLOCStatusNotify())
  dispatch(watchInitUpdLOCValueNotify())
  dispatch(watchInitUpdLOCStringNotify())
  // TODO MINT-85 Get rid of this duplicated watch callbacks below, this logic should be incorporated into the
  // TODO watchInit* action creators above
  LOCsManagerDAO.newLOCWatch((locModel) => dispatch(handleNewLOC(locModel)))
  LOCsManagerDAO.remLOCWatch((address) => dispatch(handleRemoveLOC(address)))
  LOCsManagerDAO.updLOCStatusWatch((address, status) => dispatch(handleUpdateLOCValue(address, 'status', status)))
  LOCsManagerDAO.updLOCValueWatch((address, valueName, value) => dispatch(handleUpdateLOCValue(address, valueName, value)))
  LOCsManagerDAO.updLOCStringWatch((address, valueName, value) => dispatch(handleUpdateLOCValue(address, valueName, value)))

  // voting TODO MINT-93 use watchInit* and _watch
  VoteDAO.newPollWatch((index) => dispatch(handleNewPoll(index)))
  VoteDAO.newVoteWatch((index) => dispatch(handleNewVote(index)))

  dispatch({type: WATCHER_CBE})
}
