/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_NETSET } from './constants'

export const netSetSelector = (state) =>
  state.get(DUCK_NETSET)

export const currentNetoworkSelector = createSelector(
  netSetSelector,
  (networksSet) =>
    networksSet.selected
)

export const displayNetworksListSelector = createSelector(
  netSetSelector,
  (networksSet) =>
    networksSet.displayNetworksList
)
