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
    platforms.map((platform) => result[platform.address] = {})

    Object.values(assets).map((asset) => {
      if (!result[asset.platform]) {
        result[asset.platform] = {}
      }
      result[asset.platform][asset.address] = tokens.getByAddress(asset.address)
    })

    return result
  },
)
