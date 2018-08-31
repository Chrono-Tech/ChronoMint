/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_ASSETS_HOLDER } from '../constants'

// eslint-disable-next-line import/prefer-default-export
export const getAssetsHolderAssets = (state) => {
  return state.get(DUCK_ASSETS_HOLDER).assets()
}

