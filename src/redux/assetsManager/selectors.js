import { createSelector } from 'reselect'
import { DUCK_ASSETS_MANAGER } from './actions'
import { getTokens } from '../tokens/selectors'

export const getSelectedTokenId = (state) => {
  const { selectedToken } = state.get(DUCK_ASSETS_MANAGER)
  return selectedToken
}

export const getSelectedToken = () => createSelector(
  [ getTokens, getSelectedTokenId ],
  (tokens, selectedTokenId) => {
    return tokens.item(selectedTokenId)
  },
)
