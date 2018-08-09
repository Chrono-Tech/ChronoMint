/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  SIDES_CLEAR,
  SIDES_CLOSE_ALL,
  SIDES_POP,
  SIDES_PUSH, SIDES_TOGGLE, SIDES_TOGGLE_MAIN_MENU,
} from './constants'

export const sidesPush = ({ component, panelKey, isOpened, className, componentProps, anchor, drawerProps, preCloseAction }) => (dispatch) => dispatch({
  type: SIDES_PUSH,
  component,
  panelKey,
  className,
  isOpened,
  componentProps,
  anchor,
  drawerProps,
  preCloseAction,
})

export const sidesPop = (key) => (dispatch) => dispatch({ type: SIDES_POP, key })

export const sidesClear = () => (dispatch) => dispatch({ type: SIDES_CLEAR })

export const sidesCloseAll = () => (dispatch) => dispatch({ type: SIDES_CLOSE_ALL })

export const toggleSidePanel = (panelKey, isOpened) => (dispatch) => dispatch({ type: SIDES_TOGGLE, panelKey, isOpened })

export const toggleMainMenu = (mainMenuIsOpen) => (dispatch) => dispatch({ type: SIDES_TOGGLE_MAIN_MENU, mainMenuIsOpen })

export const sidesClose = sidesPop
export const sidesOpen = sidesPush
