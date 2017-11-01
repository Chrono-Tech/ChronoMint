import AbstractContractDAO from './AbstractContractDAO'

const TX_ASSET_CREATED = 'AssetCreated'
export default class PlatformTokenExtensionGatewayManagerEmitterDAO extends AbstractContractDAO {

  constructor (at = null) {
    super(
      require('chronobank-smart-contracts/build/contracts/PlatformTokenExtensionGatewayManagerEmitter.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  watchAssetCreate (callback, account) {
    this._watch(TX_ASSET_CREATED, callback, { by: account })
  }
}
