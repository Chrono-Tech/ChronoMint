/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ConfirmTxDialog from '../../components/dialogs/ConfirmTxDialog/ConfirmTxDialog'
import {
  MODALS_PUSH,
  MODALS_REPLACE,
  MODALS_POP,
  MODALS_CLEAR,
} from './constants'

export const modalsPush = ({ component, props }) => (dispatch) => dispatch({ type: MODALS_PUSH, component, props })

export const modalsReplace = ({ component, props }) => (dispatch) => dispatch({ type: MODALS_REPLACE, component, props })

export const modalsPop = () => (dispatch) => dispatch({ type: MODALS_POP })

export const modalsClear = () => (dispatch) => dispatch({ type: MODALS_CLEAR })

export const modalsClose = modalsPop
export const modalsOpen = modalsPush
export const modalsShow = modalsPush

export const modalsOpenConfirmDialog = ({ props }) => (dispatch) => dispatch({ type: MODALS_PUSH, component: ConfirmTxDialog, props })
