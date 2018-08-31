/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { ChronoBankAssetABI, MultiEventsHistoryABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'

export const TX_PAUSE = 'pause'
export const TX_UNPAUSE = 'unpause'
export const CALL_PAUSED = 'paused'
export const TX_RESTRICT = 'restrict'
export const TX_UNRESTRICT = 'unrestrict'
export const CALL_BLACKLIST = 'blacklist'

export const TX_RESTRICTED = 'Restricted'
export const TX_UNRESTRICTED = 'Unrestricted'
export const TX_PAUSED = 'Paused'
export const TX_UNPAUSED = 'Unpaused'

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

  restrict (address: Array<string>): boolean {
    return this._tx(TX_RESTRICT, [ address ])
  }

  unrestrict (address: Array<string>): boolean {
    return this._tx(TX_UNRESTRICT, [ address ])
  }

  blacklist (address): boolean {
    return this._call(CALL_BLACKLIST, [ address ])
  }
}
