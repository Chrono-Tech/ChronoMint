import { Map } from 'immutable'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import LOCDAO, { Setting, SettingString, SettingNumber } from './LOCDAO'
import LOCNoticeModel, { ADDED, REMOVED, UPDATED } from '../models/notices/LOCNoticeModel'
import LOCModel from '../models/LOCModel'

export default class LOCManagerDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/ChronoMint.json'), at)
  }

  getLOCCount () {
    return this._call('getLOCCount').then(r => r.toNumber())
  }

  getLOCs () {
    return this._call('getLOCs').then(r => {
      const promises = []
      let locs = new Map([])
      r.forEach(address => {
        if (this.isEmptyAddress(address)) {
          return
        }
        const loc = new LOCDAO(address)
        let promise = loc.loadLOC()
        promise.then(locModel => {
          locs = locs.set(address, locModel)
        })
        promises.push(promise)
      })
      return Promise.all(promises).then(() => locs)
    })
  }

  updateLOC (data) {
    const loc = new LOCDAO(data.address)
    const promises = []
    SettingString.forEach(settingName => {
      if (data[settingName] === undefined) return
      let value = data[settingName]
      let settingIndex = Setting.get(settingName)
      promises.push(loc.getString(settingName).then(r => {
        if (r === value) return
        return this._tx('setLOCString', [
          data.address,
          settingIndex,
          this._c.toBytes32(value)
        ])
      }))
    })

    SettingNumber.forEach(settingName => {
      if (data[settingName] === undefined) return
      let value = +data[settingName]

      if (settingName === 'issueLimit' || settingName === 'issued') {
        value *= 100000000
      }

      let settingIndex = Setting.get(settingName)
      promises.push(loc.getValue(settingName).then(r => {
        if (r === value) return
        return this._tx('setLOCValue', [data.address, settingIndex, value])
      }))
    })

    if (data.status) {
      promises.push(loc.getStatus().then(r => {
        if (r === data.status) return
        return this._tx('setLOCStatus', [data.address, data.status])
      }))
    }

    const {publishedHash} = data
    if (publishedHash) {
      promises.push(loc.getString('publishedHash').then(r => {
        if (r === publishedHash) return
        return this._tx('setLOCString', [
          data.address,
          Setting.get('publishedHash'),
          this._c.ipfsHashToBytes32(publishedHash)
        ])
      }))
    }

    return Promise.all(promises)
  }

  proposeLOC (loc: LOCModel) {
    const {locName, website, issueLimit, publishedHash, expDate} = loc.toJS()
    return this._tx('proposeLOC', [
      this._c.toBytes32(locName),
      this._c.toBytes32(website),
      issueLimit * 100000000,
      this._c.ipfsHashToBytes32(publishedHash),
      expDate
    ])
  }

  removeLOC (address) {
    return this._tx('removeLOC', [address])
  }

  newLOCWatch (callback) {
    return this.contract.then(deployed => {
      let blockNumber = null
      this.web3.eth.getBlockNumber((e, r) => {
        blockNumber = r
        deployed.newLOC({}, {}, (e, r) => {
          if (r.blockNumber <= blockNumber) return
          const loc = new LOCDAO(r.args._LOC)
          loc.loadLOC().then(locModel => callback(locModel))
        })
      })
    })
  }

  remLOCWatch (callback) {
    return this.contract.then(deployed => {
      let blockNumber = null
      this.web3.eth.getBlockNumber((e, r) => {
        blockNumber = r
        deployed.remLOC({}, {}, (e, r) => {
          if (r.blockNumber <= blockNumber) return
          callback(r.args._LOC)
        })
      })
    })
  }

  updLOCStatusWatch (callback) {
    return this.contract.then(deployed => {
      let blockNumber = null
      this.web3.eth.getBlockNumber((e, r) => {
        blockNumber = r
        deployed.updLOCStatus({}, {}, (e, r) => {
          if (r.blockNumber <= blockNumber) return
          const status = r.args._status.toNumber()
          callback(r.args._LOC, status)
        })
      })
    })
  }

  updLOCValueWatch (callback) {
    return this.contract.then(deployed => {
      let fromBlock = null
      this.web3.eth.getBlockNumber((e, r) => {
        fromBlock = r
        const instance = deployed.updLOCValue({}, {fromBlock})
        instance.watch((e, r) => {
          if (r.blockNumber <= fromBlock) return
          const value = r.args._value.toNumber()
          const setting = r.args._name.toNumber()
          const settingName = Setting.findKey(key => key === setting)
          callback(r.args._LOC, settingName, value, instance)
        })
      })
    })
  }

  updLOCStringWatch (callback) {
    return this.contract.then(deployed => {
      let blockNumber = null
      this.web3.eth.getBlockNumber((e, r) => {
        blockNumber = r
        deployed.updLOCString({}, {}, (e, r) => {
          if (r.blockNumber <= blockNumber) return
          const setting = r.args._name.toNumber()
          const settingName = Setting.findKey(key => key === setting)
          const value = settingName === 'publishedHash'
            ? this._c.bytes32ToIPFSHash(r.args._value)
            : this._c.bytesToString(r.args._value)
          callback(r.args._LOC, settingName, value)
        })
      })
    })
  }

  watchNewLOCNotify (callback) {
    this.watch('newLOC', (r, block, time, isOld) => {
      const loc = new LOCDAO(r.args._LOC)
      loc.loadLOC().then(locModel =>
        callback(new LOCNoticeModel({time, loc: locModel, action: ADDED}, isOld))
      )
    })
  }

  watchRemoveLOCNotify (callback) {
    this.watch('remLOC', (r, block, time, isOld) => {
      const loc = new LOCDAO(r.args._LOC)
      loc.loadLOC().then(locModel =>
        callback(new LOCNoticeModel({time, loc: locModel, action: REMOVED}), isOld)
      )
    })
  }

  watchUpdLOCStatusNotify (callback) {
    this.watch('updLOCStatus', (r, block, time, isOld) => {
      const value = r.args._status.toNumber()
      const valueName = 'status'
      const loc = new LOCDAO(r.args._LOC)
      loc.loadLOC().then(locModel =>
        callback(new LOCNoticeModel({time, loc: locModel, action: UPDATED, params: {valueName, value}}), isOld)
      )
    })
  }

  watchUpdLOCValueNotify (callback) {
    this.watch('updLOCValue', (r, block, time, isOld) => {
      const value = r.args._value.toNumber()
      const setting = r.args._name.toNumber()
      const valueName = Setting.findKey(key => key === setting)
      const loc = new LOCDAO(r.args._LOC)
      loc.loadLOC().then(locModel =>
        callback(new LOCNoticeModel({time, loc: locModel, action: UPDATED, params: {valueName, value}}), isOld)
      )
    })
  }

  watchUpdLOCStringNotify (callback) {
    this.watch('updLOCString', (r, block, time, isOld) => {
      let value = this._c.bytesToString(r.args._value)
      const setting = r.args._name.toNumber()
      const valueName = Setting.findKey(key => key === setting)
      if (valueName === 'publishedHash') {
        value = this._c.bytes32ToIPFSHash(r.args._value)
      }
      const loc = new LOCDAO(r.args._LOC)
      loc.loadLOC().then(locModel =>
        callback(new LOCNoticeModel({time, loc: locModel, action: UPDATED, params: {valueName, value}}), isOld)
      )
    })
  }
}
