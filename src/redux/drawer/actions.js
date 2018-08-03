/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  DRAWER_HIDE,
  DRAWER_TOGGLE,
} from './constants'

export const drawerToggle = () => (dispatch) => {
  dispatch({ type: DRAWER_TOGGLE })
}
export const drawerHide = () => (dispatch) => {
  dispatch({ type: DRAWER_HIDE })
}
