import AbstractContractDAO from './AbstractContractDAO'
import { PlatformTokenExtensionGatewayManagerEmitterABI, MultiEventsHistoryABI } from './abi'

const TX_ASSET_CREATED = 'AssetCreated'
export default class PlatformTokenExtensionGatewayManagerEmitterDAO extends AbstractContractDAO {

  constructor (at = null) {
    super(PlatformTokenExtensionGatewayManagerEmitterABI, at, MultiEventsHistoryABI)
  }

  watchAssetCreate (callback, account) {
    this._watch(TX_ASSET_CREATED, callback, { by: account })
  }
}
