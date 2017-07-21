import { Map } from 'immutable'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import LOCNoticeModel, { statuses } from 'models/notices/LOCNoticeModel'
import LOCModel from 'models/LOCModel'
import locStatuses from 'components/pages/LOCsPage/LOCBlock/statuses'

export const standardFuncs = {
  GET_LOC_COUNT: 'getLOCCount',
  GET_LOC_BY_NAME: 'getLOCByName',
  GET_LOC_BY_ID: 'getLOCById',
  ADD_LOC: 'addLOC',
  SET_LOC: 'setLOC'
}

export const multisigFuncs = {
  SEND_ASSET: 'sendAsset',
  REISSUE_ASSET: 'reissueAsset',
  REVOKE_ASSET: 'revokeAsset',
  REMOVE_LOC: 'removeLOC',
  SET_STATUS: 'setStatus'
}

const events = {
  NEW_LOC: 'NewLOC',
  REMOVE_LOC: 'RemLOC',
  UPDATE_LOC: 'UpdLOCName',
  UPDATE_LOC_STATUS: 'UpdLOCStatus',
  REISSUE: 'Reissue',
  REVOKE: 'Revoke'
}

// TODO @dkchv: refactor with LHT token
const AMOUNT_DECIMALS = 100000000

/** @namespace result.args.locName */
/** @namespace result.args.newName */

export default class LOCManagerDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(
      require('chronobank-smart-contracts/build/contracts/LOCManager.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  getLOCCount () {
    return this._callNum(standardFuncs.GET_LOC_COUNT)
  }

  /** @private */
  _createLOCModel ([name, website, issued, issueLimit, publishedHash, expDate, status, securityPercentage, currency, createDate]) {
    return new LOCModel({
      name: this._c.bytesToString(name),
      website: this._c.bytesToString(website),
      issued: issued.toNumber() / AMOUNT_DECIMALS,
      issueLimit: issueLimit.toNumber() / AMOUNT_DECIMALS,
      publishedHash: this._c.bytes32ToIPFSHash(publishedHash),
      expDate: expDate.toNumber(),
      createDate: createDate.toNumber() * 1000,
      status: status.toNumber(),
      securityPercentage: securityPercentage.toNumber(),
      currency: this._c.bytesToString(currency),
      isNew: false,
      isPending: false
    })
  }

  async watchNewLOC (callback) {
    return this._watch(events.NEW_LOC, async (result) => {
      const name = this._c.bytesToString(result.args.locName)
      const loc: LOCModel = await this.fetchLOC(name)
      callback(loc, new LOCNoticeModel({name, action: statuses.ADDED}))
    })
  }

  watchRemoveLOC (callback) {
    return this._watch(events.REMOVE_LOC, async (result) => {
      const name = this._c.bytesToString(result.args.locName)
      callback(name, new LOCNoticeModel({name, action: statuses.REMOVED}))
    })
  }

  async watchUpdateLOC (callback) {
    return this._watch(events.UPDATE_LOC, async (result) => {
      const oldLocName = this._c.bytesToString(result.args.locName)
      const name = this._c.bytesToString(result.args.newName)
      const loc: LOCModel = await this.fetchLOC(name)
      callback(loc.oldName(oldLocName), new LOCNoticeModel({name, action: statuses.UPDATED}))
    })
  }

  async watchUpdateLOCStatus (callback) {
    return this._watch(events.UPDATE_LOC_STATUS, async (result) => {
      const name = this._c.bytesToString(result.args.locName)
      const loc: LOCModel = await this.fetchLOC(name)
      callback(loc, new LOCNoticeModel({name, action: statuses.STATUS_UPDATED}))
    })
  }

  async watchReissue (callback) {
    return this._watch(events.REISSUE, async (result) => {
      const name = this._c.bytesToString(result.args.locName)
      const amount = result.args.value.toNumber() / AMOUNT_DECIMALS
      const loc: LOCModel = await this.fetchLOC(name)
      callback(loc, new LOCNoticeModel({name, action: statuses.ISSUED, amount}))
    })
  }

  async watchRevoke (callback) {
    return this._watch(events.REVOKE, async (result) => {
      const name = this._c.bytesToString(result.args.locName)
      const amount = result.args.value.toNumber() / AMOUNT_DECIMALS
      const loc: LOCModel = await this.fetchLOC(name)
      callback(loc, new LOCNoticeModel({name, action: statuses.REVOKED, amount}))
    })
  }

  async fetchLOC (name: string) {
    const rawData = await this._call(standardFuncs.GET_LOC_BY_NAME, [
      this._c.stringToBytes(name)
    ])
    return this._createLOCModel(rawData)
  }

  async getLOCs () {
    let locsMap = new Map({})
    const locCount = await this._call(standardFuncs.GET_LOC_COUNT)
    const locArray = new Array(locCount.toNumber()).fill(null)

    return Promise.all(locArray.map(async (item, index) => {
      const rawData = await this._call(standardFuncs.GET_LOC_BY_ID, [index])
      return this._createLOCModel(rawData)
    })).then(values => {
      values.forEach(item => {
        locsMap = locsMap.set(item.name(), item)
      })
      return locsMap
    })
  }

  async addLOC (loc: LOCModel) {
    // TODO @bshevchenko: use models getters for explicity instead of code below
    //noinspection JSUnresolvedFunction
    const {name, website, issueLimit, publishedHash, expDate, currency} = loc.toJS()
    return this._tx(standardFuncs.ADD_LOC, [
      this._c.stringToBytes(name),
      this._c.stringToBytes(website),
      issueLimit * 100000000,
      this._c.ipfsHashToBytes32(publishedHash),
      expDate,
      currency
    ], {name, website, issueLimit, publishedHash, expDate: loc.expDateString(), currency: loc.currency()})
  }

  updateLOC (loc: LOCModel) {
    // TODO @bshevchenko: use models getters for explicity instead of code below
    //noinspection JSUnresolvedFunction
    const {name, oldName, website, issueLimit, publishedHash, expDate} = loc.toJS()
    return this._tx(standardFuncs.SET_LOC, [
      this._c.stringToBytes(oldName),
      this._c.stringToBytes(name),
      this._c.stringToBytes(website),
      issueLimit * 100000000,
      this._c.ipfsHashToBytes32(publishedHash),
      expDate
    ], {name, website, issueLimit, publishedHash, expDate: loc.expDateString()})
  }

  async removeLOC (name: string) {
    return this._multisigTx(multisigFuncs.REMOVE_LOC, [
      this._c.stringToBytes(name)
    ], {name})
  }

  async issueAsset (amount: number, name: string) {
    return this._multisigTx(multisigFuncs.REISSUE_ASSET, [
      amount * AMOUNT_DECIMALS,
      this._c.stringToBytes(name)
    ], {amount, name})
  }

  async revokeAsset (amount: number, name: string) {
    return this._multisigTx(multisigFuncs.REVOKE_ASSET, [
      amount * AMOUNT_DECIMALS,
      this._c.stringToBytes(name)
    ], {amount, name})
  }

  async updateStatus (status: number, name: string) {
    return this._multisigTx(multisigFuncs.SET_STATUS, [
      this._c.stringToBytes(name),
      status
    ], {name, status: locStatuses[status].token})
  }
}
