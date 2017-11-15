import { ChronoBankAssetProxyABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'

export default class ChronoBankAssetProxyDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(ChronoBankAssetProxyABI, at)
  }

  getLatestVersion () {
    return this._call('getLatestVersion')
  }

  getVersionFor (address) {
    return this._call('getVersionFor', [address])
  }

  feePercent () {
    return this._call('feePercent')
  }

}
