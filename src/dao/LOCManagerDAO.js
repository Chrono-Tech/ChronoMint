import { Map } from 'immutable'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import LOCNoticeModel, { ADDED, REMOVED, UPDATED } from '../models/notices/LOCNoticeModel'
import LOCModel from '../models/LOCModel'
import ContractsManagerDAO from './ContractsManagerDAO'

export default class LOCManagerDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/ChronoMint.json'), at)
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

  async watchNewLOC (callback) {
    const eventsDAO = await ContractsManagerDAO.getEmitterDAO()
    eventsDAO.watch('NewLOC', async (result, block, time, isOld) => {
      const name = this._c.bytesToString(result.args.locName)
      const loc: LOCModel = await this.fetchLOC(name)
      callback(loc, new LOCNoticeModel({name, action: ADDED}), isOld)
    }, false)
  }

  async watchRemoveLOC (callback) {
    const eventsDAO = await ContractsManagerDAO.getEmitterDAO()
    eventsDAO.watch('RemLOC', async (result, block, time, isOld) => {
      const name = this._c.bytesToString(result.args.locName)
      callback(name, new LOCNoticeModel({name, action: REMOVED}), isOld)
    }, false)
  }

  async watchUpdateLOC (callback) {
    const eventsDAO = await ContractsManagerDAO.getEmitterDAO()
    eventsDAO.watch('UpdLOCValue', async (result, block, time, isOld) => {
      const oldLocName = this._c.bytesToString(result.args.oldLocName)
      const name = this._c.bytesToString(result.args.newLocName)
      const loc: LOCModel = await this.fetchLOC(name)
      callback(loc.oldName(oldLocName), new LOCNoticeModel({name, action: UPDATED}), isOld)
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

  async addLOC (loc: LOCModel) {
    const {name, website, issueLimit, publishedHash, expDate, currency} = loc.toJS()
    return this._tx('addLOC', [
      this._c.toBytes32(name),
      this._c.toBytes32(website),
      issueLimit * 100000000,
      this._c.ipfsHashToBytes32('QmdFFTvS2gyoD9br7RpJai9XoYGebgu1G6ejSDm8M2PVGD'),
      // this._c.ipfsHashToBytes32(publishedHash),
      expDate,
      currency
    ])
  }

  updateLOC (loc: LOCModel) {
    const {name, oldName, website, issueLimit, publishedHash, expDate} = loc.toJS()
    return this._tx('setLOC', [
      this._c.toBytes32(oldName),
      this._c.toBytes32(name),
      this._c.toBytes32(website),
      issueLimit * 100000000,
      this._c.ipfsHashToBytes32('QmdFFTvS2gyoD9br7RpJai9XoYGebgu1G6ejSDm8M2PVGD'),
      // this._c.ipfsHashToBytes32(publishedHash),
      expDate
    ])
  }

  removeLOC (loc: LOCModel) {
    return this._tx('removeLOC', [
      this._c.toBytes32(loc.name())
    ])
  }
}
