import {Map} from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import LOCDAO, {Setting, SettingString, SettingNumber} from './LOCDAO'
import LOCNoticeModel, {ADDED, REMOVED, UPDATED} from '../models/notices/LOCNoticeModel'
import LOCModel from '../models/LOCModel'

class LOCsManagerDAO extends AbstractContractDAO {
  getLOCCount = (account: string) => {
    return this.contract
      .then(deployed => deployed.getLOCCount.call({from: account}))
      .then(counter => counter.toNumber())
  };

  getLOCs = (account: string) => {
    return this.contract.then(deployed => deployed.getLOCs.call({from: account}).then(r => {
      const promises = []
      let locs = new Map([])
      r.forEach(address => {
        const loc = new LOCDAO(address)
        let promise = loc.loadLOC(account)
        promise.then(locModel => {
          locs = locs.set(address, locModel)
        })
        promises.push(promise)
      })
      return Promise.all(promises).then(() => locs)
    }))
  };

  updateLOC (data: Array, account: string) {
    const loc = new LOCDAO(data.address)
    const promises = []
    return this.contract.then(deployed => {
      SettingString.forEach(settingName => {
        if (data[settingName] === undefined) return
        let value = data[settingName]
        let settingIndex = Setting.get(settingName)
        promises.push(loc.getString(settingName, account).then(r => {
          if (r === value) return
          return deployed.setLOCString(data.address, settingIndex, this._toBytes32(value), {from: account})
        }))
      })

      SettingNumber.forEach(settingName => {
        if (data[settingName] === undefined) return
        let value = +data[settingName]
        let settingIndex = Setting.get(settingName)
        promises.push(loc.getValue(settingName, account).then(r => {
          if (r === value) return
          return deployed.setLOCValue(data.address, settingIndex, value, {from: account, gas: 3000000})
        }))
      })

      if (data.status) {
        promises.push(loc.getStatus(account).then(r => {
          if (r === data.status) return
          return deployed.setLOCStatus(data.address, data.status, {from: account, gas: 3000000})
        }))
      }

      const {publishedHash} = data
      if (publishedHash) {
        promises.push(loc.getString('publishedHash', account).then(r => {
          if (r === publishedHash) return
          deployed.setLOCString(data.address, Setting.get('publishedHash'), this._IPFSHashToBytes32(publishedHash), {from: account})
        }))
      }

      return Promise.all(promises)
    })
  }

  proposeLOC = (loc: LOCModel, account: string) => {
    const {locName, website, issueLimit, publishedHash, expDate} = loc.toJS()

    return this.contract.then(deployed => deployed.proposeLOC(
      this._toBytes32(locName), this._toBytes32(website), issueLimit,
      this._IPFSHashToBytes32(publishedHash),
      expDate, {
        from: account,
        gas: 3000000
      }
    ))
  };

  removeLOC = (address: string, account: string) => {
    return this.contract.then(deployed => deployed.removeLOC(address, {from: account, gas: 3000000}))
  };

  newLOCWatch = (callback, account: string) => this.contract.then(deployed => {
    let blockNumber = null
    this.web3.eth.getBlockNumber((e, r) => {
      blockNumber = r
      deployed.newLOC({}, {}, (e, r) => {
        if (r.blockNumber <= blockNumber) return
        const loc = new LOCDAO(r.args._LOC)
        loc.loadLOC(account).then(locModel => callback(locModel))
      })
    })
  });

  remLOCWatch = callback => this.contract.then(deployed => {
    let blockNumber = null
    this.web3.eth.getBlockNumber((e, r) => {
      blockNumber = r
      deployed.remLOC({}, {}, (e, r) => {
        if (r.blockNumber <= blockNumber) return
        callback(r.args._LOC)
      })
    })
  });

  updLOCStatusWatch = callback => this.contract.then(deployed => {
    let blockNumber = null
    this.web3.eth.getBlockNumber((e, r) => {
      blockNumber = r
      deployed.updLOCStatus({}, {}, (e, r) => {
        if (r.blockNumber <= blockNumber) return
        const status = r.args._status.toNumber()
        callback(r.args._LOC, status)
      })
    })
  });

  updLOCValueWatch = callback => this.contract.then(deployed => {
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
  });

  updLOCStringWatch = callback => this.contract.then(deployed => {
    let blockNumber = null
    this.web3.eth.getBlockNumber((e, r) => {
      blockNumber = r
      deployed.updLOCString({}, {}, (e, r) => {
        if (r.blockNumber <= blockNumber) return
        const setting = r.args._name.toNumber()
        const settingName = Setting.findKey(key => key === setting)
        const value = settingName === 'publishedHash'
          ? this._bytes32ToIPFSHash(r.args._value)
          : this._bytesToString(r.args._value)
        callback(r.args._LOC, settingName, value)
      })
    })
  });

  watchNewLOCNotify (callback, account: string) {
    this.contract.then(deployed =>
            this._watch(deployed.newLOC, (r, block, time, isOld) => {
              const loc = new LOCDAO(r.args._LOC)
              loc.loadLOC(account).then(locModel =>
                    callback(new LOCNoticeModel({time, loc: locModel, action: ADDED}, isOld))
                )
            }, 'newLOCNotify')
        )
  }

  watchRemoveLOCNotify (callback, account: string) {
    this.contract.then(deployed =>
            this._watch(deployed.remLOC, (r, block, time, isOld) => {
              const loc = new LOCDAO(r.args._LOC)
              loc.loadLOC(account).then(locModel =>
                    callback(new LOCNoticeModel({time, loc: locModel, action: REMOVED}), isOld)
                )
            }, 'removeLOCNotify')
        )
  }

  watchUpdLOCStatusNotify (callback, account: string) {
    this.contract.then(deployed =>
            this._watch(deployed.updLOCStatus, (r, block, time, isOld) => {
              const value = r.args._status.toNumber()
              const valueName = 'status'
              const loc = new LOCDAO(r.args._LOC)
              loc.loadLOC(account).then(locModel =>
                    callback(new LOCNoticeModel({time, loc: locModel, action: UPDATED, params: {valueName, value}}), isOld)
                )
            }, 'updLOCStatusNotify')
        )
  }

  watchUpdLOCValueNotify (callback, account: string) {
    this.contract.then(deployed =>
            this._watch(deployed.updLOCValue, (r, block, time, isOld) => {
              const value = r.args._value.toNumber()
              const setting = r.args._name.toNumber()
              const valueName = Setting.findKey(key => key === setting)
              const loc = new LOCDAO(r.args._LOC)
              loc.loadLOC(account).then(locModel =>
                    callback(new LOCNoticeModel({time, loc: locModel, action: UPDATED, params: {valueName, value}}), isOld)
                )
            }, 'updLOCValueNotify')
        )
  }

  watchUpdLOCStringNotify (callback, account: string) {
    this.contract.then(deployed =>
            this._watch(deployed.updLOCString, (r, block, time, isOld) => {
              let value = this._bytesToString(r.args._value)
              const setting = r.args._name.toNumber()
              const valueName = Setting.findKey(key => key === setting)
              if (valueName === 'publishedHash') {
                value = this._bytes32ToIPFSHash(r.args._value)
              }
              const loc = new LOCDAO(r.args._LOC)
              loc.loadLOC(account).then(locModel =>
                    callback(new LOCNoticeModel({time, loc: locModel, action: UPDATED, params: {valueName, value}}), isOld)
                )
            }, 'updLOCStringNotify')
        )
  }
}

export default new LOCsManagerDAO(require('chronobank-smart-contracts/build/contracts/ChronoMint.json'))
