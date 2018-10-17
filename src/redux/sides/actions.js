/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  SIDES_CLEAR,
  SIDES_CLOSE_ALL,
  SIDES_CLOSE,
  SIDES_OPEN,
  SIDES_TOGGLE_MAIN_MENU,
  SIDES_TOGGLE, SIDES_SELECT_BLOCKCHAIN_IN_MAIN_MENU,
} from './constants'

export const sidesOpen = (props) =>
  ({
    type: SIDES_OPEN,
    ...props,
  })

export const sidesClose = (key) =>
  ({
    type: SIDES_CLOSE,
    key,
  })

export const sidesClear = () =>
  ({
    type: SIDES_CLEAR,
  })

export const sidesCloseAll = () =>
  ({
    type: SIDES_CLOSE_ALL,
  })

export const toggleSidePanel = (panelKey, isOpened) =>
  ({
    type: SIDES_TOGGLE,
    panelKey,
    isOpened,
  })

export const toggleMainMenu = (mainMenuIsOpen) =>
  ({
    type: SIDES_TOGGLE_MAIN_MENU,
    mainMenuIsOpen,
  })

export const selectBlockchainInMainMenu = (selectedBlockchain) =>
  ({
    type: SIDES_SELECT_BLOCKCHAIN_IN_MAIN_MENU,
    selectedBlockchain,
  })
