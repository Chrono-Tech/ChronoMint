import AbstractContractDAO from './AbstractContractDAO'

export default class AssetDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/ChronoBankAsset.json'), at)
  }

  getProxyAddress () {
    return new Promise((resolve, reject) => {
      this._call('proxy').then(address => {
        if (address === '0x') {
          reject(new Error('No proxy'))
        } else {
          resolve(address)
        }
      }).catch(e => reject(e))
    })
  }
}
