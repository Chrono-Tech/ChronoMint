import { createSelector } from 'reselect'
import TokenModel from 'models/tokens/TokenModel'
import { getTokens } from '../tokens/selectors'

export const getToken = (tokenId: string) => createSelector(
  [getTokens],
  (tokens) => {
    return tokenId ? tokens.item(tokenId) : new TokenModel()
  },
)
