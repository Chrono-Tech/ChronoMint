/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  MODALS_OPEN,
  MODALS_REPLACE,
  MODALS_CLOSE,
  MODALS_CLEAR,
} from './constants'

export const modalsOpen = ({ componentName, props }) =>
  ({
    type: MODALS_OPEN,
    componentName,
    props,
  })

export const modalsReplace = ({ componentName, props }) =>
  ({
    type: MODALS_REPLACE,
    componentName,
    props,
  })

export const modalsClose = () =>
  ({
    type: MODALS_CLOSE,
  })

export const modalsClear = () =>
  ({
    type: MODALS_CLEAR,
  })
