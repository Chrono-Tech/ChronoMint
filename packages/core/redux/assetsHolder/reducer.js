/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AssetHolderModel from '../../models/assetHolder/AssetHolderModel'
import * as a from './constants'

const initialState = new AssetHolderModel()

export default (state = initialState, action) => {
  switch (action.type) {
    case a.ASSET_HOLDER_INIT:
      return state.isInited(true)
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
