import AbstractContractDAO from './AbstractContractDAO'

export default class AssetDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('../contracts/ChronoBankAsset.json'), at)
  }

  getProxyAddress = () => {
    return this.contract.then(deployed => {
      return deployed.proxy.call()
    })
  };
}
