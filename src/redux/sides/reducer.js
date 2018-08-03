/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ProfileContent from 'layouts/partials/ProfileContent/ProfileContent'
import NotificationContent from 'layouts/partials/NotificationContent/NotificationContent'
import MenuAssetsManagerMoreInfo from 'layouts/partials/DrawerMainMenu/MenuAssetsManagerMoreInfo/MenuAssetsManagerMoreInfo'

import {
  MENU_ASSETS_MANAGER_PANEL_KEY,
  NOTIFICATION_PANEL_KEY,
  PROFILE_SIDE_PANEL_KEY,
  SIDES_CLEAR,
  SIDES_CLOSE_ALL,
  SIDES_POP,
  SIDES_PUSH,
  SIDES_TOGGLE_MAIN_MENU,
  SIDES_TOGGLE,
} from './constants'

const initialState = {
  isProfilePanelOpen: false,
  mainMenuIsOpen: false,
  stack: {
    [PROFILE_SIDE_PANEL_KEY]: {
      component: ProfileContent,
      panelKey: PROFILE_SIDE_PANEL_KEY,
      isOpened: false,
      direction: 'right',
      drawerProps: {
        width: 300,
      },
    },
    [NOTIFICATION_PANEL_KEY]: {
      component: NotificationContent,
      panelKey: NOTIFICATION_PANEL_KEY,
      isOpened: false,
      anchor: 'right',
    },
    [MENU_ASSETS_MANAGER_PANEL_KEY]: {
      component: MenuAssetsManagerMoreInfo,
      panelKey: MENU_ASSETS_MANAGER_PANEL_KEY,
      isOpened: false,
      anchor: 'left',
    },
  },
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SIDES_PUSH:
      return {
        ...state,
        stack: {
          ...state.stack,
          [action.panelKey]: {
            panelKey: action.panelKey,
            component: action.component,
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
      Object.keys(state.stack).map((key) => {
        newStackToClose[key].isOpened = false
      })
      return {
        ...state,
        stack: {
          ...newStackToClose,
        },
      }
    case SIDES_POP:
      let newStack = { ...state.stack }
      delete newStack[action.panelKey]

      return {
        ...state,
        stack: { ...newStack },
      }
    case SIDES_CLEAR:
      return {
        ...state,
        stack: [],
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
