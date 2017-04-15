import AbstractContractDAO from './AbstractContractDAO'

export default class AssetDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('../contracts/ChronoBankAsset.json'), at)
  }

  getProxyAddress () {
    return new Promise((resolve, reject) => {
      this.contract.then(deployed => {
        deployed.proxy.call().then(address => {
          if (address === '0x') {
            reject(new Error('No proxy'))
          } else {
            resolve(address)
          }
        }).catch(e => reject(e))
      })
    })
  }
}
