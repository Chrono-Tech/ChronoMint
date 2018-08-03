/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { ChronoBankPlatformABI, MultiEventsHistoryABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'

//#region CONSTANTS

import {
  TX_ADD_ASSET_PART_OWNER,
  TX_IS_REISSUABLE,
  TX_ISSUE,
  TX_OWNERSHIP_CHANGE,
  TX_REISSUE_ASSET,
  TX_REMOVE_ASSET_PART_OWNER,
  TX_REVOKE_ASSET,
  TX_REVOKE,
} from './constants/ChronoBankPlatformDAO'

//#endregion CONSTANTS

export default class ChronoBankPlatformDAO extends AbstractContractDAO {

  constructor ({ address, history, abi }) {
    super({ address, history, abi })
  }

  connect (web3, options) {
    super.connect(web3, options)

    this.allEventsEmitter = this.history.events.allEvents({})
      .on('data', this.handleEventsData.bind(this))
      .on('changed', this.handleEventsChanged.bind(this))
      .on('error', this.handleEventsError.bind(this))
  }

  disconnect () {
    if (this.isConnected) {
      this.allEventsEmitter.removeAllListeners()
      this.contract = null
      this.history = null
      this.web3 = null
    }
  }

  handleEventsData (data) {
    if (!data.event) {
      return
    }
    console.log('ChronoBankPlatformDAO handleEventsData: ', data.event, data)
    this.emit(data.event, data)
  }

  handleEventsChanged (data) {
    console.log('ChronoBankPlatformDAO handleEventsChanged: ', data.event, data)
  }

  handleEventsError (data) {
    console.log('ChronoBankPlatformDAO handleEventsError: ', data.event, data)
    this.emit(data.event + '_error', data)
  }

  async reissueAsset (token, value) {
    try {
      const amount = token.addDecimals(value, token)
      const tx = await this._tx(
        TX_REISSUE_ASSET,
        [
          token.symbol(),
          amount,
        ],
        {
          symbol: token.symbol(),
          amount: value,
        })
      return tx.tx
    } catch (e) {
      // eslint-disable-next-line
    }
  }

  async revokeAsset (token, value) {
    const amount = token.addDecimals(value, token)
    const tx = await this._tx(
      TX_REVOKE_ASSET,
      [
        token.symbol(),
        amount,
      ],
      {
        symbol: token.symbol(),
        amount: value,
      })
    return tx.tx
  }

  isReissuable (symbol) {
    return this._call(TX_IS_REISSUABLE, [ symbol ])
  }

  async addAssetPartOwner (symbol, address) {
    const tx = await this._tx(TX_ADD_ASSET_PART_OWNER, [ symbol, address ])
    return tx.tx
  }

  async removeAssetPartOwner (symbol, address) {
    const tx = await this._tx(TX_REMOVE_ASSET_PART_OWNER, [ symbol, address ])
    return tx.tx
  }

  watchIssue (callback) {
    return this.on(TX_ISSUE, (tx) => callback(tx))
  }

  watchRevoke (callback) {
    return this.on(TX_REVOKE, (tx) => callback(tx))
  }

  watchManagers (callback) {
    return this.on(TX_OWNERSHIP_CHANGE, callback)
  }
}
