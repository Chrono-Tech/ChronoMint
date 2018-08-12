/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  SIDES_CLEAR,
  SIDES_CLOSE_ALL,
  SIDES_CLOSE,
  SIDES_INIT,
  SIDES_OPEN,
  SIDES_TOGGLE_MAIN_MENU,
  SIDES_TOGGLE,
} from './constants'

// This action is used once at SidesStack.jsx to init stack of side panels
export const initSidesStack = (stack) => (dispatch) =>
  dispatch({
    type: SIDES_INIT,
    stack,
  })

export const sidesOpen = (props) => (dispatch) =>
  dispatch({
    type: SIDES_OPEN,
    ...props,
  })

export const sidesClose = (key) => (dispatch) =>
  dispatch({
    type: SIDES_CLOSE,
    key,
  })

export const sidesClear = () => (dispatch) =>
  dispatch({
    type: SIDES_CLEAR,
  })

export const sidesCloseAll = () => (dispatch) =>
  dispatch({
    type: SIDES_CLOSE_ALL,
  })

export const toggleSidePanel = (panelKey, isOpened) => (dispatch) =>
  dispatch({
    type: SIDES_TOGGLE,
    panelKey,
    isOpened,
  })

export const toggleMainMenu = (mainMenuIsOpen) => (dispatch) =>
  dispatch({
    type: SIDES_TOGGLE_MAIN_MENU,
    mainMenuIsOpen,
  })
