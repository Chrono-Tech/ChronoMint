/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import TokensCollection from 'models/tokens/TokensCollection'
import { getTokens } from 'redux/tokens/selectors'
import { getSelectedTokenId, getPlatforms, getAssets } from 'redux/assetsManager/selectors/models'

export const getSelectedToken = () => createSelector(
  [getTokens, getSelectedTokenId],
  (tokens, selectedTokenId) => {
    return tokens.item(selectedTokenId)
  },
)

export const getUserTokens = () => createSelector(
  [getTokens, getPlatforms, getAssets],
  (tokens: TokensCollection, platforms, assets) => {
    let result = {}
    platforms.forEach((platform) => result[platform.address] = {})

    Object.values(assets).forEach((asset) => {
      const assetPlatform = asset.platform
      const assetAddress = asset.address

      if (!result.hasOwnProperty(assetPlatform)) {
        result[assetPlatform] = {}
      }
      result[assetPlatform][assetAddress] = tokens.getByAddress(assetAddress)
    })

    return result
  },
)
