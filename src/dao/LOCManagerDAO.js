import { Map } from 'immutable'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import LOCNoticeModel, { ADDED, REMOVED, UPDATED } from '../models/notices/LOCNoticeModel'
import LOCModel from '../models/LOCModel'

export default class LOCManagerDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/LOCManager.json'), at)
  }

  getLOCCount () {
    return this._call('getLOCCount').then(r => r.toNumber())
  }

  getLOCs () {
    // TODO @dkchv: deprecated, fixed in MINT-85
    return Promise.resolve(new Map([]))
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
}
