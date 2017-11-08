import MultiEventsHistoryABI from 'chronobank-smart-contracts/build/contracts/MultiEventsHistory.json'
import PlatformTokenExtensionGatewayManagerEmitterABI from 'chronobank-smart-contracts/build/contracts/PlatformTokenExtensionGatewayManagerEmitter.json'
import AbstractContractDAO from './AbstractContractDAO'

const TX_ASSET_CREATED = 'AssetCreated'
export default class PlatformTokenExtensionGatewayManagerEmitterDAO extends AbstractContractDAO {

  constructor (at = null) {
    super(PlatformTokenExtensionGatewayManagerEmitterABI, at, MultiEventsHistoryABI)
  }

  watchAssetCreate (callback, account) {
    this._watch(TX_ASSET_CREATED, callback, { by: account })
  }
}
