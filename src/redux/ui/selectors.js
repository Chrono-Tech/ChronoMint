/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import { createSelector } from 'reselect'
import { DUCK_UI } from './constants'

export const getValueSessionStorage = (key) => createSelector(
  (localStorage) => localStorage,
  (l) => l && l.getItem(key),
)

export const UIDuckSelector = (state) => state.get(DUCK_UI)

export const getCookiesBarVisible = createSelector(
  UIDuckSelector,
  (ui) => ui.isCookiesBarVisible,
)
