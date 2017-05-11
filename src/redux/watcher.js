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
} from './notifier/watchers' // TODO Move out this action creators to LOC ducks
import { watchInitTransfer } from './wallet/actions'
import { watchInitCBE } from './settings/cbe'
import { watchInitToken } from './settings/tokens'
import { watchInitContract as watchInitOtherContract } from './settings/otherContracts'
import { handleNewPoll, handleNewVote } from './polls/data'
import { watchInitOperation } from './operations/actions'

// next two actions represents start of the events watching
export const WATCHER = 'watcher'
export const WATCHER_CBE = 'watcher/CBE'

export const watcher = (account) => (dispatch) => { // for all logged in users
  AbstractContractDAO.txStart = (tx: TransactionExecModel) => {
    console.log('Pending tx:', tx.summary())
    dispatch(transactionStart())
    // TODO MINT-170 add tx to pending list
  }
  AbstractContractDAO.txGas = (id, gas: number) => {
    console.log('Pending tx:', id, 'gas', gas)
    // TODO MINT-170 update tx gas
  }
  AbstractContractDAO.txEnd = (id, e: Error = null) => {
    console.log('Tx end:', id, e)
    if (e) {
      dispatch(showAlertModal({title: 'Transaction error', message: e.message}))
    }
    // TODO MINT-170 remove tx from pending list
  }

  // wallet
  dispatch(watchInitTransfer(account))

  dispatch({type: WATCHER})
}

export const cbeWatcher = (account) => (dispatch) => { // only for CBE
  // settings
  dispatch(watchInitCBE())
  dispatch(watchInitToken())
  dispatch(watchInitOtherContract())

  dispatch(watchInitOperation())

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
