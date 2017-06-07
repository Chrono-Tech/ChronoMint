import { Map } from 'immutable'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import LOCNoticeModel, { statuses } from '../models/notices/LOCNoticeModel'
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
      callback(loc, new LOCNoticeModel({name, action: statuses.ADDED}), isOld)
    }, false)
  }

  async watchRemoveLOC (callback) {
    const eventsDAO = await ContractsManagerDAO.getEmitterDAO()
    eventsDAO.watch('RemLOC', async (result, block, time, isOld) => {
      const name = this._c.bytesToString(result.args.locName)
      callback(name, new LOCNoticeModel({name, action: statuses.REMOVED}), isOld)
    }, false)
  }

  async watchUpdateLOC (callback) {
    const eventsDAO = await ContractsManagerDAO.getEmitterDAO()
    eventsDAO.watch('UpdLOCValue', async (result, block, time, isOld) => {
      const oldLocName = this._c.bytesToString(result.args.oldLocName)
      const name = this._c.bytesToString(result.args.newLocName)
      const loc: LOCModel = await this.fetchLOC(name)
      callback(loc.oldName(oldLocName), new LOCNoticeModel({name, action: statuses.UPDATED}), isOld)
    }, false)
  }

  async watchUpdateLOCStatus (callback) {
    const eventsDAO = await ContractsManagerDAO.getEmitterDAO()
    eventsDAO.watch('UpdLOCStatus', async (result, block, time, isOld) => {
      const name = this._c.bytesToString(result.args.locName)
      const loc: LOCModel = await this.fetchLOC(name)
      callback(loc, new LOCNoticeModel({name, action: statuses.STATUS_UPDATED}), isOld)
    }, false)
  }

  async watchReissue (callback) {
    const eventsDAO = await ContractsManagerDAO.getEmitterDAO()
    eventsDAO.watch('Reissue', async (result, block, time, isOld) => {
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

  async addLOC (loc: LOCModel) {
    const {name, website, issueLimit, publishedHash, expDate, status, currency} = loc.toJS()
    return this._tx('addLOC', [
      this._c.toBytes32(name),
      this._c.toBytes32(website),
      issueLimit * 100000000,
      this._c.ipfsHashToBytes32(publishedHash),
      expDate,
      status,
      this._c.toBytes32(currency)
    ], null, (r) => {
      // TODO @dkchv: handle add error
      console.log('--LOCManagerDAO#', r)
      return true
    })
  }

  updateLOC (loc: LOCModel) {
    const {name, oldName, website, issueLimit, publishedHash, expDate, status} = loc.toJS()
    return this._tx('setLOC', [
      this._c.toBytes32(oldName),
      this._c.toBytes32(name),
      this._c.toBytes32(website),
      issueLimit * 100000000,
      this._c.ipfsHashToBytes32(publishedHash),
      expDate,
      status
    ], null, (r) => {
      // TODO @dkchv: handle update error
      console.log('--LOCManagerDAO#', r)
      return true
    })
  }

  removeLOC (loc: LOCModel) {
    return this._tx('removeLOC', [
      this._c.toBytes32(loc.name())
    ])
  }

  issueAsset (amount: number, locName: string) {
    return this._tx('reissueAsset', [
      amount * 100000000,
      this._c.toBytes32(locName)
    ], null, (r) => {
      // TODO @dkchv: waiting for SC update
      console.log('--LOCManagerDAO#', r)
      return true
    })
  }

  updateStatus (status: number, locName: string) {
    return this._tx('reissueAsset', [
      status,
      this._c.toBytes32(locName)
    ], null, (r) => {
      // TODO @dkchv: waiting for SC update
      console.log('--LOCManagerDAO#', r)
      return true
    })
  }
}
