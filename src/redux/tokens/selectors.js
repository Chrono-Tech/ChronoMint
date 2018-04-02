import { createSelector } from 'reselect'
import TokenModel from 'models/tokens/TokenModel'

import { DUCK_TOKENS } from './actions'

export const getTokens = (state) => {
  return state.get(DUCK_TOKENS)
}

export const getTokenDAO = (token) => createSelector(
  [ getTokens ],
  (tokens) => {
    const id = token instanceof TokenModel ? token.id() : token
    return
  }
)
