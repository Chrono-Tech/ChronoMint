import AbstractContractDAO from './AbstractContractDAO'

export default class ChronoBankAssetProxyDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(require('chronobank-smart-contracts/build/contracts/ChronoBankAssetProxy.json'), at)
  }

  getLatestVersion () {
    return this._call('getLatestVersion')
  }

  getVersionFor (address) {
    return this._call('getVersionFor', [address])
  }

}
