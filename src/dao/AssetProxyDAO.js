import AbstractProxyDAO from './AbstractProxyDAO'

export default class AssetProxyDAO extends AbstractProxyDAO {
  constructor (at) {
    super(require('../contracts/ChronoBankAssetProxy.json'), at)
  }
}
