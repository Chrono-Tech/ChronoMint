/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  MENU_ASSETS_MANAGER_PANEL_KEY,
  NOTIFICATION_PANEL_KEY,
  PROFILE_SIDE_PANEL_KEY,
  SIDES_CLEAR,
  SIDES_CLOSE_ALL,
  SIDES_CLOSE,
  SIDES_OPEN,
  SIDES_TOGGLE_MAIN_MENU,
  SIDES_TOGGLE, SIDES_SELECT_BLOCKCHAIN_IN_MAIN_MENU,
} from './constants'

const initialState = {
  isProfilePanelOpen: false,
  mainMenuIsOpen: false,
  stack: {
    [PROFILE_SIDE_PANEL_KEY]: {
      componentName: 'ProfileContent',
      panelKey: PROFILE_SIDE_PANEL_KEY,
      isOpened: false,
      direction: 'right',
      drawerProps: {
        width: 300,
      },
    },
    [NOTIFICATION_PANEL_KEY]: {
      componentName: 'NotificationContent',
      panelKey: NOTIFICATION_PANEL_KEY,
      isOpened: false,
      anchor: 'right',
    },
    [MENU_ASSETS_MANAGER_PANEL_KEY]: {
      componentName: 'MenuAssetsManagerMoreInfo',
      panelKey: MENU_ASSETS_MANAGER_PANEL_KEY,
      isOpened: false,
      anchor: 'left',
    },
  },
}

export default (state = initialState, action) => {
  switch (action.type) {
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
    case SIDES_SELECT_BLOCKCHAIN_IN_MAIN_MENU:
      return {
        ...state,
        selectedBlockchain: action.selectedBlockchain,
      }
    default:
      return state
  }
}
