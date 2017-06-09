import { Map } from 'immutable'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import LOCNoticeModel, { statuses } from '../models/notices/LOCNoticeModel'
import LOCModel from '../models/LOCModel'

export default class LOCManagerDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/LOCManager.json'), at)
  }

  getLOCCount () {
    return this._call('getLOCCount').then(r => r.toNumber())
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

  /**
   * @private
   */
  createErrorCallback (loc: LOCModel, callback) {
    return (dryRunResult) => {
      if (dryRunResult === false) {
        callback(loc, new LOCNoticeModel({name: loc.name(), action: statuses.FAILED}))
      }
      return dryRunResult
    }
  }

  async watchNewLOC (callback) {
    this.watch('NewLOC', async (result, block, time, isOld) => {
      const name = this._c.bytesToString(result.args.locName)
      const loc: LOCModel = await this.fetchLOC(name)
      callback(loc, new LOCNoticeModel({name, action: statuses.ADDED}), isOld)
    }, false)
  }

  watchRemoveLOC (callback) {
    return this.watch('RemLOC', async (result, block, time, isOld) => {
      const name = this._c.bytesToString(result.args.locName)
      callback(name, new LOCNoticeModel({name, action: statuses.REMOVED}), isOld)
    }, false)
  }

  async watchUpdateLOC (callback) {
    return this.watch('UpdLOCName', async (result, block, time, isOld) => {
      const oldLocName = this._c.bytesToString(result.args.locName)
      const name = this._c.bytesToString(result.args.newName)
      const loc: LOCModel = await this.fetchLOC(name)
      callback(loc.oldName(oldLocName), new LOCNoticeModel({name, action: statuses.UPDATED}), isOld)
    }, false)
  }

  async watchUpdateLOCStatus (callback) {
    return this.watch('UpdLOCStatus', async (result, block, time, isOld) => {
      const name = this._c.bytesToString(result.args.locName)
      const loc: LOCModel = await this.fetchLOC(name)
      callback(loc, new LOCNoticeModel({name, action: statuses.STATUS_UPDATED}), isOld)
    }, false)
  }

  async watchReissue (callback) {
    return this.watch('Reissue', async (result, block, time, isOld) => {
      const name = this._c.bytesToString(result.args.locName)
      const loc: LOCModel = await this.fetchLOC(name)
      callback(loc, new LOCNoticeModel({name, action: statuses.ISSUED}), isOld)
    }, false)
  }

  async fetchLOC (name: string) {
    const rawData = await this._call('getLOCByName', [
      this._c.toBytes32(name)
    ])
    return this.createLOCModel(rawData)
  }

  async getLOCs () {
    let locsMap = new Map({})
    const locCount = await this._call('getLOCCount')
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

  async addLOC (loc: LOCModel, callback) {
    const {name, website, issueLimit, publishedHash, expDate, currency} = loc.toJS()
    return this._tx('addLOC', [
      this._c.toBytes32(name),
      this._c.toBytes32(website),
      issueLimit * 100000000,
      this._c.ipfsHashToBytes32(publishedHash),
      expDate,
      this._c.toBytes32(currency)
    ], null, (r) => {
      // TODO @dkchv: SC return count instead of bool
      console.log('--LOCManagerDAO#addLOC', r.toNumber())
      return false
    })
  }

  updateLOC (loc: LOCModel, callback) {
    const {name, oldName, website, issueLimit, publishedHash, expDate, status} = loc.toJS()
    return this._tx('setLOC', [
      this._c.toBytes32(oldName),
      this._c.toBytes32(name),
      this._c.toBytes32(website),
      issueLimit * 100000000,
      this._c.ipfsHashToBytes32(publishedHash),
      expDate
    ], null, this.createErrorCallback(loc, callback))
  }

  removeLOC (loc: LOCModel, callback) {
    return this._tx('removeLOC', [
      this._c.toBytes32(loc.name())
    ], null, this.createErrorCallback(loc, callback))
  }

  issueAsset (amount: number, loc: LOCModel, callback) {
    return this._tx('reissueAsset', [
      amount * 100000000,
      this._c.toBytes32(loc.name())
    ], null, this.createErrorCallback(loc, callback))
  }

  revokeAsset (amount: number, loc: LOCModel, callback) {
    return this._tx('revokeAsset', [
      amount * 100000000,
      this._c.toBytes32(loc.name())
    ], null, this.createErrorCallback(loc, callback))
  }

  updateStatus (status: number, loc: LOCModel, callback) {
    return this._tx('setStatus', [
      this._c.toBytes32(loc.name()),
      this._c.toBytes32(status)
    ], null, this.createErrorCallback(loc, callback))
  }
}
