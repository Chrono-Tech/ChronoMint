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

const initialState = {
  isProfilePanelOpen: false,
  mainMenuIsOpen: false,
  stack: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SIDES_INIT:
      return {
        ...state,
        stack: action.stack
      }
    case SIDES_OPEN:
      return {
        ...state,
        stack: {
          ...state.stack,
          [action.panelKey]: {
            panelKey: action.panelKey,
            componentName: action.componentName,
            componentProps: action.componentProps,
            className: action.className,
            isOpened: action.isOpened,
            anchor: action.anchor,
            drawerProps: action.drawerProps,
            preCloseAction: action.preCloseAction,
          },
        },
      }
    case SIDES_TOGGLE:
      return {
        ...state,
        stack: {
          ...state.stack,
          [action.panelKey]: {
            ...state.stack[action.panelKey],
            isOpened: action.isOpened,
          },
        },
      }
    case SIDES_CLOSE_ALL:
      let newStackToClose = { ...state.stack }
      Object.keys(state.stack).forEach((key) => {
        newStackToClose[key].isOpened = false
      })
      return {
        ...state,
        stack: {
          ...newStackToClose,
        },
      }
    case SIDES_CLOSE:
      let newStack = { ...state.stack }
      delete newStack[action.panelKey]

      return {
        ...state,
        stack: { ...newStack },
      }
    case SIDES_CLEAR:
      return {
        ...state,
        stack: {},
      }
    case SIDES_TOGGLE_MAIN_MENU:
      return {
        ...state,
        mainMenuIsOpen: action.mainMenuIsOpen,
      }
    default:
      return state
  }
}
