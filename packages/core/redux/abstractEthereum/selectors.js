/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'

import { DUCK_NAME } from './constants'

const mainScopeSelector = () => (state) => state.get(DUCK_NAME)

export const blockchainScopeSelector = (blockchain) => createSelector(
  mainScopeSelector(),
  (scope) => scope[blockchain],
)
