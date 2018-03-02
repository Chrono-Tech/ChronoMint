import { MultiEventsHistoryABI, ChronoBankAssetABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'

export const TX_PAUSE = 'pause'
export const TX_UNPAUSE = 'unpause'
export const CALL_PAUSED = 'paused'

export default class ChronoBankAssetDAO extends AbstractContractDAO {

  constructor (at = null) {
    super(ChronoBankAssetABI, at, MultiEventsHistoryABI)
  }

  getPauseStatus () {
    return this._call(CALL_PAUSED)
  }

  pause () {
    return this._tx(TX_PAUSE)
  }

  unpause () {
    return this._tx(TX_UNPAUSE)
  }
}
