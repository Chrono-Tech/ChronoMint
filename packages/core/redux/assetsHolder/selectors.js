/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_ASSETS_HOLDER } from './actions'

export const getAssetsFromAssetHolder = (state) => {
  const assetHolder = state.get(DUCK_ASSETS_HOLDER)
  return assetHolder.assets()
}
