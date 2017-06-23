import { Map } from 'immutable'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import LOCNoticeModel, { statuses } from '../models/notices/LOCNoticeModel'
import LOCModel from '../models/LOCModel'
import locStatuses from '../components/pages/LOCsPage/LOCBlock/statuses'

export const standardFuncs = {
  GET_LOC_COUNT: 'getLOCCount',
  GET_LOC_BY_NAME: 'getLOCByName',
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
  REISSUE: 'Reissue'
}

export default class LOCManagerDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(
      require('chronobank-smart-contracts/build/contracts/LOCManager.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  getLOCCount () {
    return this._call(standardFuncs.GET_LOC_COUNT).then(r => r.toNumber())
  }

  /**
   * @private
   */
  createLOCModel ([name, website, issued, issueLimit, publishedHash, expDate, status, securityPercentage, currency, createDate]) {
    return new LOCModel({
      name: this._c.bytesToString(name),
      website: this._c.bytesToString(website),
      issued: issued.toNumber() / 100000000,
      issueLimit: issueLimit.toNumber() / 100000000,
      publishedHash: this._c.bytes32ToIPFSHash(publishedHash),
      expDate: expDate.toNumber(),
      createDate: createDate.toNumber() * 1000,
      status: status.toNumber(),
      securityPercentage: securityPercentage.toNumber(),
      currency: +this._c.bytesToString(currency),
      isNew: false,
      isPending: false
    })
  }

  async watchNewLOC (callback) {
    return this._watch(events.NEW_LOC, async (result, block, time, isOld) => {
      const name = this._c.bytesToString(result.args.locName)
      const loc: LOCModel = await this.fetchLOC(name)
      callback(loc, new LOCNoticeModel({name, action: statuses.ADDED}), isOld)
    }, false)
  }

  watchRemoveLOC (callback) {
    return this._watch(events.REMOVE_LOC, async (result, block, time, isOld) => {
      const name = this._c.bytesToString(result.args.locName)
      callback(name, new LOCNoticeModel({name, action: statuses.REMOVED}), isOld)
    }, false)
  }

  async watchUpdateLOC (callback) {
    return this._watch(events.UPDATE_LOC, async (result, block, time, isOld) => {
      const oldLocName = this._c.bytesToString(result.args.locName)
      const name = this._c.bytesToString(result.args.newName)
      const loc: LOCModel = await this.fetchLOC(name)
      callback(loc.oldName(oldLocName), new LOCNoticeModel({name, action: statuses.UPDATED}), isOld)
    }, false)
  }

  async watchUpdateLOCStatus (callback) {
    return this._watch(events.UPDATE_LOC_STATUS, async (result, block, time, isOld) => {
      const name = this._c.bytesToString(result.args.locName)
      const loc: LOCModel = await this.fetchLOC(name)
      callback(loc, new LOCNoticeModel({name, action: statuses.STATUS_UPDATED}), isOld)
    }, false)
  }

  async watchReissue (callback) {
    return this._watch(events.REISSUE, async (result, block, time, isOld) => {
      const name = this._c.bytesToString(result.args.locName)
      const loc: LOCModel = await this.fetchLOC(name)
      callback(loc, new LOCNoticeModel({name, action: statuses.ISSUED}), isOld)
    }, false)
  }

  async fetchLOC (name: string) {
    const rawData = await this._call(standardFuncs.GET_LOC_BY_NAME, [
      this._c.toBytes32(name)
    ])
    return this.createLOCModel(rawData)
  }

  async getLOCs () {
    let locsMap = new Map({})
    const locCount = await this._call(standardFuncs.GET_LOC_COUNT)
    const locArray = new Array(locCount.toNumber()).fill(null)

    return Promise.all(locArray.map(async (item, index) => {
      const rawData = await this._call('getLOCById', [index])
      return this.createLOCModel(rawData)
    })).then(values => {
      values.forEach(item => {
        locsMap = locsMap.set(item.name(), item)
      })
      return locsMap
    })
  }

  async addLOC (loc: LOCModel) {
    const {name, website, issueLimit, publishedHash, expDate, currency} = loc.toJS()
    return this._tx(standardFuncs.ADD_LOC, [
      this._c.toBytes32(name),
      this._c.toBytes32(website),
      issueLimit * 100000000,
      this._c.ipfsHashToBytes32(publishedHash),
      expDate,
      this._c.toBytes32(currency)
    ], {name, website, issueLimit, publishedHash, expDate: loc.expDateString(), currency: loc.currencyString()})
  }

  updateLOC (loc: LOCModel) {
    const {name, oldName, website, issueLimit, publishedHash, expDate} = loc.toJS()
    return this._tx(standardFuncs.SET_LOC, [
      this._c.toBytes32(oldName),
      this._c.toBytes32(name),
      this._c.toBytes32(website),
      issueLimit * 100000000,
      this._c.ipfsHashToBytes32(publishedHash),
      expDate
    ], {name, website, issueLimit, publishedHash, expDate: loc.expDateString()})
  }

  async removeLOC (name: string) {
    return this._multisigTx(multisigFuncs.REMOVE_LOC, [
      this._c.toBytes32(name)
    ], {name})
  }

  async issueAsset (amount: number, name: string) {
    return this._multisigTx(multisigFuncs.REISSUE_ASSET, [
      amount * 100000000,
      this._c.toBytes32(name)
    ], {amount, name})
  }

  async revokeAsset (amount: number, name: string) {
    return this._multisigTx(multisigFuncs.REVOKE_ASSET, [
      amount * 100000000,
      this._c.toBytes32(name)
    ], {amount, name})
  }

  async updateStatus (status: number, name: string) {
    return this._multisigTx(multisigFuncs.SET_STATUS, [
      this._c.toBytes32(name),
      this._c.toBytes32(status)
    ], {name, status: locStatuses[status].token})
  }
}
