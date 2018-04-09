/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { getTokens } from '../tokens/selectors'

export const getToken = (tokenId: string) => createSelector(
  [ getTokens ],
  (tokens) => {
    return tokens.item(tokenId)
  },
)
