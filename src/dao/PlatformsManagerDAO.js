/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { MultiEventsHistoryABI, PlatformsManagerABI } from './abi'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'

export const TX_CREATE_PLATFORM = 'createPlatform'
export const TX_ATTACH_PLATFORM = 'attachPlatform'
export const TX_DETACH_PLATFORM = 'detachPlatform'
export const TX_REISSUE_ASSET = 'reissueAsset'
export const TX_PLATFORM_REQUESTED = 'PlatformRequested'
export const TX_PLATFORM_ATTACHED = 'PlatformAttached'
export const TX_PLATFORM_DETACHED = 'PlatformDetached'

export default class PlatformsManagerDAO extends AbstractMultisigContractDAO {

  constructor (at = null) {
    super(PlatformsManagerABI, at, MultiEventsHistoryABI)
  }

  async reissueAsset (symbol, amount) {
    const tx = await this._tx(TX_REISSUE_ASSET, [ symbol, amount ])
    return tx.tx
  }

  async createPlatform () {
    const tx = await this._tx(TX_CREATE_PLATFORM)
    return tx.tx
  }

  async attachPlatform (address) {
    let tx
    try {
      tx = await this._multisigTx(TX_ATTACH_PLATFORM, [ address ])
    } catch (e) {
      // eslint-disable-next-line
      console.error(e.message)
    }
    return tx.tx
  }

  async detachPlatform (address) {
    let tx
    try {
      tx = await this._tx(TX_DETACH_PLATFORM, [ address ])
    } catch (e) {
      // eslint-disable-next-line
      console.error(e.message)
    }
    return tx.tx
  }

  watchCreatePlatform (callback, account) {
    this._watch(TX_PLATFORM_REQUESTED, (tx) => callback(tx), { by: account })
    this._watch(TX_PLATFORM_ATTACHED, (tx) => callback(tx), { by: account })
    this._watch(TX_PLATFORM_DETACHED, (tx) => callback(tx), { by: account })
  }

  async _decodeArgs (func, args: Object) {
    switch (func) {
      case TX_ATTACH_PLATFORM:
        return {
          platform: args[ '_platform' ],
        }
      default:
        return args
    }
  }
}
