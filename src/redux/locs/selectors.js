import { createSelector } from 'reselect'
import { getTokens } from '../tokens/selectors'

export const getToken = (tokenId: string) => createSelector(
  [ getTokens ],
  (tokens) => {
    return tokens.item(tokenId)
  },
)
