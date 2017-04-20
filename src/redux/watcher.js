import LOCsManagerDAO from '../dao/LOCsManagerDAO'
import PendingManagerDAO from '../dao/PendingManagerDAO'
import VoteDAO from '../dao/VoteDAO'
import { handleNewLOC, handleRemoveLOC, handleUpdateLOCValue } from './locs/list/actions'
import {
  watchInitNewLOCNotify,
  watchInitRemoveLOCNotify,
  watchInitUpdLOCStatusNotify,
  watchInitUpdLOCValueNotify,
  watchInitUpdLOCStringNotify
} from './notifier/watchers'
import { watchInitTransfer } from './wallet/actions'
import { watchInitCBE } from './settings/cbe'
import { watchInitToken } from './settings/tokens'
import { watchInitContract as watchInitOtherContract } from './settings/otherContracts'
import { handlePendingConfirmation, handleRevokeOperation } from './pendings/data'
import { handleNewPoll, handleNewVote } from './polls/data'

export const WATCHER = 'watcher'
export const WATCHER_CBE = 'watcher/CBE'

export const watcher = (account) => (dispatch) => {
  dispatch(watchInitTransfer(account))
  dispatch({type: WATCHER})
}

export const cbeWatcher = (account) => (dispatch) => {
  /** SETTINGS >>> **/
  dispatch(watchInitCBE(account))
  dispatch(watchInitToken(account))
  dispatch(watchInitOtherContract(account))
  /** <<< SETTINGS **/

  LOCsManagerDAO.newLOCWatch((locModel) => dispatch(handleNewLOC(locModel)), account)
  LOCsManagerDAO.remLOCWatch((address) => dispatch(handleRemoveLOC(address)))
  LOCsManagerDAO.updLOCStatusWatch((address, status) => dispatch(handleUpdateLOCValue(address, 'status', status)))
  LOCsManagerDAO.updLOCValueWatch((address, valueName, value) => dispatch(handleUpdateLOCValue(address, valueName, value)))
  LOCsManagerDAO.updLOCStringWatch((address, valueName, value) => dispatch(handleUpdateLOCValue(address, valueName, value)))

  dispatch(watchInitNewLOCNotify(account))
  dispatch(watchInitRemoveLOCNotify(account))
  dispatch(watchInitUpdLOCStatusNotify(account))
  dispatch(watchInitUpdLOCValueNotify(account))
  dispatch(watchInitUpdLOCStringNotify(account))

  PendingManagerDAO.newConfirmationWatch((operation) => dispatch(handlePendingConfirmation(operation, account)))
  PendingManagerDAO.newRevokeOperationWatch((operation) => dispatch(handleRevokeOperation(operation, account)))
  VoteDAO.newPollWatch((index) => dispatch(handleNewPoll(index)))
  VoteDAO.newVoteWatch((index) => dispatch(handleNewVote(index)))

  dispatch({type: WATCHER_CBE})
}
