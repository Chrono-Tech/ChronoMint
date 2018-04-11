/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_ASSETS_MANAGER } from './actions'
import { getTokens } from '../tokens/selectors'

export const getSelectedTokenId = (state) => {
  return state.get(DUCK_ASSETS_MANAGER).selectedToken()
}

export const getSelectedToken = () => createSelector(
  [ getTokens, getSelectedTokenId ],
  (tokens, selectedTokenId) => {
    return tokens.item(selectedTokenId)
  },
)
