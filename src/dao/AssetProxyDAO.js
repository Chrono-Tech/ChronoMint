import AbstractProxyDAO from './AbstractProxyDAO'

export default class AssetProxyDAO extends AbstractProxyDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/ChronoBankAssetProxy.json'), at)
  }
}
