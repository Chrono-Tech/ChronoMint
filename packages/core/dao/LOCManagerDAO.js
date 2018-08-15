/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import LOCModel from '../models/LOCModel'
import LOCNoticeModel, { statuses } from '../models/notices/LOCNoticeModel'
import type TokenModel from '../models/tokens/TokenModel'
import tokenService from '../services/TokenService'
import Amount from '../models/Amount'
import { LOCManagerABI, MultiEventsHistoryABI } from './abi'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'

//#region CONSTANTS

import {
  LHT,
} from './constants'
import {
  events,
  multisigFuncs,
  standardFuncs,
} from './constants/LOCManagerDAO'

//#endregion CONSTANTS

/** @namespace result.args.locName */
/** @namespace result.args.newName */

export default class LOCManagerDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(LOCManagerABI, at, MultiEventsHistoryABI)
  }

  async getTokenDAO (symbol) {
    return tokenService.getDAO(symbol)
  }

  /** @private */
  async _createLOCModel ([ name, website, issued, issueLimit, publishedHash, expDate, status, securityPercentage, currency, createDate ]) {
    const symbol = this._c.bytesToString(currency)

    return new LOCModel({
      name: this._c.bytesToString(name),
      website: this._c.bytesToString(website),
      issued: new Amount(issued, LHT),
      issueLimit: new Amount(issueLimit, LHT),
      publishedHash: this._c.bytes32ToIPFSHash(publishedHash),
      expDate: expDate.toNumber(),
      createDate: createDate.toNumber() * 1000,
      status: status.toNumber(),
      securityPercentage: securityPercentage.toNumber(),
      symbol,
      isNew: false,
      isPending: false,
    })
  }

  async watchNewLOC (callback) {
    return this._watch(events.NEW_LOC, async (result) => {
      const name = this._c.bytesToString(result.args.locName)
      const loc: LOCModel = await this.fetchLOC(name)
      callback(loc, new LOCNoticeModel({ name, action: statuses.ADDED }))
    })
  }

  watchRemoveLOC (callback) {
    return this._watch(events.REMOVE_LOC, async (result) => {
      const name = this._c.bytesToString(result.args.locName)
      callback(name, new LOCNoticeModel({ name, action: statuses.REMOVED }))
    })
  }

  async watchUpdateLOC (callback) {
    return this._watch(events.UPDATE_LOC, async (result) => {
      const oldLocName = this._c.bytesToString(result.args.locName)
      const name = this._c.bytesToString(result.args.newName)
      const loc: LOCModel = await this.fetchLOC(name)
      callback(loc.oldName(oldLocName), new LOCNoticeModel({ name, action: statuses.UPDATED }))
    })
  }

  async watchUpdateLOCStatus (callback) {
    return this._watch(events.UPDATE_LOC_STATUS, async (result) => {
      const name = this._c.bytesToString(result.args.locName)
      const loc: LOCModel = await this.fetchLOC(name)
      callback(loc, new LOCNoticeModel({ name, action: statuses.STATUS_UPDATED }))
    })
  }

  async watchReissue (callback) {
    return this._watch(events.REISSUE, async (result) => {
      const name = this._c.bytesToString(result.args.locName)
      const loc: LOCModel = await this.fetchLOC(name)
      const amount = result.args.value
      callback(loc, new LOCNoticeModel({ name, action: statuses.ISSUED, amount }))
    })
  }

  async watchRevoke (callback) {
    return this._watch(events.REVOKE, async (result) => {
      const name = this._c.bytesToString(result.args.locName)
      const loc: LOCModel = await this.fetchLOC(name)
      const amount = result.args.value
      callback(loc, new LOCNoticeModel({ name, action: statuses.REVOKED, amount }))
    })
  }

  async fetchLOC (name: string) {
    const rawData = await this._call(standardFuncs.GET_LOC_BY_NAME, [
      this._c.stringToBytes(name),
    ])
    return this._createLOCModel(rawData)
  }

  async getLOCs () {
    let locsMap = new Immutable.Map({})
    const locCount = await this._call(standardFuncs.GET_LOC_COUNT)
    const locArray = new Array(locCount.toNumber()).fill(null)

    return Promise.all(locArray.map(async (item, index) => {
      const rawData = await this._call(standardFuncs.GET_LOC_BY_ID, [ index ])
      return this._createLOCModel(rawData)
    })).then((values) => {
      values.forEach((item) => {
        locsMap = locsMap.set(item.name(), item)
      })
      return locsMap
    })
  }

  addLOC (loc: LOCModel) {
    return this._tx(standardFuncs.ADD_LOC, [
      this._c.stringToBytes(loc.name()),
      this._c.stringToBytes(loc.website()),
      new BigNumber(loc.issueLimit()),
      this._c.ipfsHashToBytes32(loc.publishedHash()),
      loc.expDate(),
      loc.currency(),
    ], {
      name: loc.name(),
      website: loc.website(),
      issueLimit: loc.issueLimit(),
      publishedHash: loc.publishedHash(),
      expDate: loc.expDateString(),
      currency: loc.currency(),
    })
  }

  updateLOC (loc: LOCModel) {
    return this._tx(standardFuncs.SET_LOC, [
      this._c.stringToBytes(loc.oldName()),
      this._c.stringToBytes(loc.name()),
      this._c.stringToBytes(loc.website()),
      new BigNumber(loc.issueLimit()),
      this._c.ipfsHashToBytes32(loc.publishedHash()),
      loc.expDate(),
    ], {
      name: loc.name(),
      website: loc.website(),
      issueLimit: loc.issueLimit(),
      publishedHash: loc.publishedHash(),
      expDate: loc.expDateString(),
    })
  }

  removeLOC (loc: LOCModel) {
    return this._multisigTx(multisigFuncs.REMOVE_LOC, [
      this._c.stringToBytes(loc.name()),
    ], {
      name: loc.name(),
    })
  }

  issueAsset (amount: Amount, loc: LOCModel) {
    return this._multisigTx(multisigFuncs.REISSUE_ASSET, [
      new BigNumber(amount),
      this._c.stringToBytes(loc.name()),
    ], {
      amount,
      name: loc.name(),
      currency: loc.currency(),
    })
  }

  sendAsset (token: TokenModel, to: string, amount: Amount) {
    const symbol = token.symbol()
    return this._multisigTx(multisigFuncs.SEND_ASSET, [ symbol, to, new BigNumber(amount) ], { symbol, to, amount })
  }

  revokeAsset (amount: Amount, loc: LOCModel) {
    return this._multisigTx(multisigFuncs.REVOKE_ASSET, [
      new BigNumber(amount),
      this._c.stringToBytes(loc.name()),
    ], {
      amount,
      name: loc.name(),
      currency: loc.currency(),
    })
  }

  updateStatus (status: number, loc: LOCModel) {
    return this._multisigTx(multisigFuncs.SET_STATUS, [
      this._c.stringToBytes(loc.name()),
      status,
    ], {
      name: loc.name(),
      status: loc.statusString(status),
    })
  }
}
