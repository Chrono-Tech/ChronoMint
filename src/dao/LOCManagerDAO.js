import type BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import LOCModel from 'models/LOCModel'
import LOCNoticeModel, { statuses } from 'models/notices/LOCNoticeModel'
import type TokenModel from 'models/tokens/TokenModel'
import { LOCManagerABI, MultiEventsHistoryABI } from './abi'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import contractManager from './ContractsManagerDAO'
import tokenService from 'services/TokenService'

export const standardFuncs = {
  GET_LOC_COUNT: 'getLOCCount',
  GET_LOC_BY_NAME: 'getLOCByName',
  GET_LOC_BY_ID: 'getLOCById',
  ADD_LOC: 'addLOC',
  SET_LOC: 'setLOC',
}

export const multisigFuncs = {
  SEND_ASSET: 'sendAsset',
  REISSUE_ASSET: 'reissueAsset',
  REVOKE_ASSET: 'revokeAsset',
  REMOVE_LOC: 'removeLOC',
  SET_STATUS: 'setStatus',
}

const events = {
  NEW_LOC: 'NewLOC',
  REMOVE_LOC: 'RemLOC',
  UPDATE_LOC: 'UpdateLOC',
  UPDATE_LOC_STATUS: 'UpdLOCStatus',
  REISSUE: 'Reissue',
  REVOKE: 'Revoke',
}

/** @namespace result.args.locName */
/** @namespace result.args.newName */

export default class LOCManagerDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(LOCManagerABI, at, MultiEventsHistoryABI)
  }

  async getTokenDAO (symbol) {
    const erc20 = await contractManager.getERC20ManagerDAO()
    const tokenAddress = await erc20.getTokenAddressBySymbol(symbol)
    return tokenService.getDAO(tokenAddress)
  }

  /** @private */
  async _createLOCModel ([name, website, issued, issueLimit, publishedHash, expDate, status, securityPercentage, currency, createDate]) {
    const symbol = this._c.bytesToString(currency)
    const tokenDAO = await this.getTokenDAO(symbol)

    return new LOCModel({
      name: this._c.bytesToString(name),
      website: this._c.bytesToString(website),
      issued: tokenDAO.removeDecimals(issued),
      issueLimit: tokenDAO.removeDecimals(issueLimit),
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
      const amount = this.getTokenDAO(loc.currency()).removeDecimals(result.args.value)
      callback(loc, new LOCNoticeModel({ name, action: statuses.ISSUED, amount }))
    })
  }

  async watchRevoke (callback) {
    return this._watch(events.REVOKE, async (result) => {
      const name = this._c.bytesToString(result.args.locName)
      const loc: LOCModel = await this.fetchLOC(name)
      const amount = this.getTokenDAO(loc.currency()).removeDecimals(result.args.value)
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
      const rawData = await this._call(standardFuncs.GET_LOC_BY_ID, [index])
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
      this.getTokenDAO(loc.currency()).addDecimals(loc.issueLimit()),
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
      this.getTokenDAO(loc.currency()).addDecimals(loc.issueLimit()),
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

  issueAsset (amount: BigNumber, loc: LOCModel) {
    return this._multisigTx(multisigFuncs.REISSUE_ASSET, [
      this.getTokenDAO(loc.currency()).addDecimals(amount),
      this._c.stringToBytes(loc.name()),
    ], {
      amount,
      name: loc.name(),
      currency: loc.currency(),
    })
  }

  sendAsset (token: TokenModel, to: string, value: BigNumber) {
    const symbol = token.symbol()
    return this._multisigTx(multisigFuncs.SEND_ASSET, [symbol, to, token.dao().addDecimals(value)], { symbol, to, value })
  }

  revokeAsset (amount: number, loc: LOCModel) {
    return this._multisigTx(multisigFuncs.REVOKE_ASSET, [
      this.getTokenDAO(loc.currency()).addDecimals(amount),
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
