import AbstractContractDAO from './AbstractContractDAO'
import LOCModel from '../models/LOCModel'
import {Map} from 'immutable'

export const Setting = new Map([['locName', 0], ['website', 1], ['controller', 2], ['issueLimit', 3], ['issued', 4],
  ['redeemed', 5], ['publishedHash', 6], ['expDate', 7]])
export const SettingString = ['locName', 'website']
export const SettingNumber = ['controller', 'issueLimit', 'issued', 'redeemed', 'expDate']

class LOCDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('../contracts/LOC.json'), at)
    this.address = at
  }

  // isController = (account) => {
  //     this.contract.then(deployed => deployed.isController.call(account, {from: account}));
  // };
  //
  getString (setting, account) {
    return this.contract
      .then(deployed => deployed
        .getString
        .call(Setting.get(setting), {from: account})
        .then(value => this._bytesToString(value))
      )
  };

  getValue (setting, account) {
    return this.contract
      .then(deployed => deployed
        .getValue
        .call(Setting.get(setting), {from: account})
        .then(value => value.toNumber())
      )
  };

  getStatus (account) {
    return this.contract
      .then(deployed => deployed
        .status
        .call({from: account})
        .then(status => status.toNumber())
      )
  };

  loadLOC (account) {
    let locModel = new LOCModel({address: this.address})

    const callBack = (valueName, value) => {
      locModel = locModel.set(valueName, value)
    }

    const promises = []

    SettingString.forEach(setting => {
      promises.push(this.getString(setting, account).then(callBack.bind(null, setting)))
    })

    SettingNumber.forEach(setting => {
      promises.push(this.getValue(setting, account).then(value => callBack(setting, value)))
    })

    promises.push(
      this.contract.getString.call(Setting.get('publishedHash'), {from: account}).then(value => callBack('publishedHash', this._bytes32ToIPFSHash(value)))
    )

    promises.push(this.getStatus(account).then(status => callBack('status', status)))

    return Promise.all(promises).then(() => locModel)
  }
}

export default LOCDAO
