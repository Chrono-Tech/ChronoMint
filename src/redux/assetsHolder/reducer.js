import AssetHolderModel from 'models/assetHolder/AssetHolderModel'
import * as a from './actions'

const initialState = new AssetHolderModel()

export default (state = initialState, action) => {
  switch (action.type) {
    case a.ASSET_HOLDER_INIT:
      return state.isInited(true)
    // case a.ASSET_HOLDER_TIME_ADDRESS:
    //   return state.assetAddress(action.address)
    case a.ASSET_HOLDER_ADDRESS:
      return state
        .account(action.account)
        .wallet(action.wallet)
    case a.ASSET_HOLDER_ASSET_UPDATE:
      return state.assets(state.assets().update(action.asset))
    default:
      return state
  }
}
