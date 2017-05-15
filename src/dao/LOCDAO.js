import AbstractContractDAO from './AbstractContractDAO'
import LOCModel from '../models/LOCModel'
import { Map } from 'immutable'

export const Setting = new Map([['locName', 0], ['website', 1], ['controller', 2], ['issueLimit', 3], ['issued', 4],
  ['redeemed', 5], ['publishedHash', 6], ['expDate', 7]])
export const SettingString = ['locName', 'website']
export const SettingNumber = ['controller', 'issueLimit', 'issued', 'redeemed', 'expDate']

class LOCDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/LOC.json'), at, false)
    this.address = at
  }

  getString (setting) {
    return this._call('getString', [Setting.get(setting)]).then(r => this.converter.bytesToString(r))
  }

  getValue (setting) {
    return this._call('getString', [Setting.get(setting)]).then(r => this.converter.toDecimal(r))
  }

  getStatus () {
    return this._call('status').then(r => r.toNumber())
  }

  loadLOC () {
    let locModel = new LOCModel({address: this.address})

    const callBack = (valueName, value) => {
      locModel = locModel.set(valueName, value)
    }

    const promises = []

    SettingString.forEach(setting => {
      promises.push(this.getString(setting).then(callBack.bind(null, setting)))
    })

    SettingNumber.forEach(setting => {
      promises.push(this.getValue(setting).then(value => callBack(setting, value)))
    })

    promises.push(
      this._call('getString', [Setting.get('publishedHash')])
        .then(r => callBack('publishedHash', this.converter.bytes32ToIPFSHash(r)))
    )

    promises.push(this.getStatus().then(status => callBack('status', status)))

    return Promise.all(promises).then(() => locModel)
  }
}

export default LOCDAO
