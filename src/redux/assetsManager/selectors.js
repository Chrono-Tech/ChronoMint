import { createSelector } from 'reselect'
import TokensCollection from 'models/tokens/TokensCollection'
import { getTokens } from '../tokens/selectors'
import { DUCK_ASSETS_MANAGER } from './actions'

export const getSelectedTokenId = (state) => {
  return state.get(DUCK_ASSETS_MANAGER).selectedToken()
}

export const getSelectedToken = () => createSelector(
  [ getTokens, getSelectedTokenId ],
  (tokens, selectedTokenId) => {
    return tokens.item(selectedTokenId)
  },
)

export const getAssets = (state) => {
  return state.get(DUCK_ASSETS_MANAGER).assets()
}

export const getPlatforms = (state) => {
  return state.get(DUCK_ASSETS_MANAGER).platformsList()
}

export const getUserTokens = () => createSelector(
  [ getTokens, getPlatforms, getAssets ],
  (tokens: TokensCollection, platforms, assets) => {
    let result = {}
    platforms.map((platform) => result[ platform.address ] = {})

    Object.values(assets).map((asset) => {
      if (!result[ asset.platform ]) {
        result[ asset.platform ] = {}
      }
      result[ asset.platform ][ asset.address ] = tokens.getByAddress(asset.address)
    })

    return result
  },
)
