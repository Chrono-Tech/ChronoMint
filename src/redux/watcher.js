import AbstractContractDAO from '../dao/AbstractContractDAO'
import LOCsManagerDAO from '../dao/LOCsManagerDAO'
import VoteDAO from '../dao/VoteDAO'
import { transactionStart } from './notifier/notifier'
import { handleNewLOC, handleRemoveLOC, handleUpdateLOCValue } from './locs/list/actions'
import {
  watchInitNewLOCNotify,
  watchInitRemoveLOCNotify,
  watchInitUpdLOCStatusNotify,
  watchInitUpdLOCValueNotify,
  watchInitUpdLOCStringNotify
} from './notifier/watchers' // TODO Move out this action creators to LOC ducks
import { watchInitTransfer } from './wallet/actions'
import { watchInitCBE } from './settings/cbe'
import { watchInitToken } from './settings/tokens'
import { watchInitContract as watchInitOtherContract } from './settings/otherContracts'
import { handleNewPoll, handleNewVote } from './polls/data'

// next two actions represents start of the events watching
export const WATCHER = 'watcher'
export const WATCHER_CBE = 'watcher/CBE'

export const watcher = (account) => (dispatch) => { // for all logged in users
  AbstractContractDAO.txStart = (tx) => {
    dispatch(transactionStart())
    // TODO add tx to list
  }
  AbstractContractDAO.txEnd = (id, fail: boolean = false) => {
    // TODO update tx in list
  }

  // wallet
  dispatch(watchInitTransfer(account))

  dispatch({type: WATCHER})
}

export const cbeWatcher = (account) => (dispatch) => { // only for CBE
  // settings
  dispatch(watchInitCBE(account))
  dispatch(watchInitToken(account))
  dispatch(watchInitOtherContract(account))

  // TODO operations

  // LOC
  dispatch(watchInitNewLOCNotify())
  dispatch(watchInitRemoveLOCNotify())
  dispatch(watchInitUpdLOCStatusNotify())
  dispatch(watchInitUpdLOCValueNotify())
  dispatch(watchInitUpdLOCStringNotify())
  // TODO MINT-85 Get rid of this duplicated watch callbacks below, this logic should be incorporated into the
  // TODO watchInit* action creators above
  LOCsManagerDAO.newLOCWatch((locModel) => dispatch(handleNewLOC(locModel)), account)
  LOCsManagerDAO.remLOCWatch((address) => dispatch(handleRemoveLOC(address)))
  LOCsManagerDAO.updLOCStatusWatch((address, status) => dispatch(handleUpdateLOCValue(address, 'status', status)))
  LOCsManagerDAO.updLOCValueWatch((address, valueName, value) => dispatch(handleUpdateLOCValue(address, valueName, value)))
  LOCsManagerDAO.updLOCStringWatch((address, valueName, value) => dispatch(handleUpdateLOCValue(address, valueName, value)))

  // voting TODO MINT-93 use watchInit* and _watch
  VoteDAO.newPollWatch((index) => dispatch(handleNewPoll(index)))
  VoteDAO.newVoteWatch((index) => dispatch(handleNewVote(index)))

  dispatch({type: WATCHER_CBE})
}
