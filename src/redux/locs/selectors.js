/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import TokenModel from 'models/tokens/TokenModel'
import { getTokens } from '../tokens/selectors'

export const getToken = (tokenId: string) => createSelector(
  [getTokens],
  (tokens) => {
    return tokenId ? tokens.item(tokenId) : new TokenModel()
  },
)
