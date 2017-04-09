import {Map} from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import LOCDAO, {Setting, SettingString, SettingNumber} from './LOCDAO'
import LOCNoticeModel, {ADDED, REMOVED, UPDATED} from '../models/notices/LOCNoticeModel'

class LOCsManagerDAO extends AbstractContractDAO {
  getLOCCount = (account: string) => {
    return this.contract.then(deployed => deployed.getLOCCount.call({from: account}))
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

      let value = data.publishedHash
      if (value) {
        const [publishedHash1, publishedHash2] = value.match(/.{1,32}/g)
        promises.push(loc.getString('publishedHash1', account).then(r => {
          if (r === publishedHash1) return
          const promises = []
          promises.push(deployed.setLOCString(data.address, Setting.get('publishedHash1'), this._toBytes32(publishedHash1), {from: account}))
          promises.push(deployed.setLOCString(data.address, Setting.get('publishedHash2'), this._toBytes32(publishedHash2), {from: account}))
          return Promise.all(promises)
        }))
      }
      return Promise.all(promises)
    })
  }

  proposeLOC = (locName: string, website: string, issueLimit: number, publishedHash: string,
                expDate: number, account: string) => {
    const [publishedHash1, publishedHash2] = publishedHash.match(/.{1,32}/g)

    return this.contract.then(deployed => deployed.proposeLOC(
      this._toBytes32(locName), this._toBytes32(website), issueLimit,
      this._toBytes32(publishedHash1), this._toBytes32(publishedHash2),
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
    let blockNumber = null
    this.web3.eth.getBlockNumber((e, r) => {
      blockNumber = r
      deployed.updLOCValue({}, {fromBlock: blockNumber}, (e, r) => {
        if (r.blockNumber <= blockNumber) return
        const value = r.args._value.toNumber()
        const setting = r.args._name.toNumber()
        const settingName = Setting.findKey(key => key === setting)
        callback(r.args._LOC, settingName, value)
      })
    })
  });

  updLOCStringWatch = callback => this.contract.then(deployed => {
    let blockNumber = null
    this.web3.eth.getBlockNumber((e, r) => {
      blockNumber = r
      deployed.updLOCString({}, {}, (e, r) => {
        if (r.blockNumber <= blockNumber) return
        const value = this._bytesToString(r.args._value)
        const setting = r.args._name.toNumber()
        const settingName = Setting.findKey(key => key === setting)
        callback(r.args._LOC, settingName, value)
      })
    })
  });

    // getLOCbyID = (index: number, account: string) => {
    //     return this.contract.then(deployed => deployed.getLOCbyID.call(index, {from: account}));
    // };
    //
    // setLOCString = (address: string, index: number, value: string, account: string) => {
    //     return this.contract.then(deployed => deployed.setLOCString(address, index, this._toBytes32(value), {from: account}));
    // };
    //
    // setLOCValue = (address: string, index: number, value: number, account: string) => {
    //     return this.contract.then(deployed => deployed.setLOCValue(address, index, value, {
    //         from: account,
    //         gas: 3000000
    //     }));
    // };
    //
    // setLOCStatus = (address: string, status: number, account: string) => {
    //     return this.contract.then(deployed => deployed.status.call().then(function(r){
    //         if (r === status) return false;
    //         deployed.setLOCStatus(address, status, {
    //             from: account, gas: 3000000});
    //         return true;
    //     }));
    // };

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
              const value = this._bytesToString(r.args._value)
              const setting = r.args._name.toNumber()
              const valueName = Setting.findKey(key => key === setting)
              const loc = new LOCDAO(r.args._LOC)
              loc.loadLOC(account).then(locModel =>
                    callback(new LOCNoticeModel({time, loc: locModel, action: UPDATED, params: {valueName, value}}), isOld)
                )
            }, 'updLOCStringNotify')
        )
  }
}

export default new LOCsManagerDAO(require('../contracts/ChronoMint.json'))
