/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ConfirmTxDialogNew from '../../components/dialogs/ConfirmTxDialogNew/ConfirmTxDialog'

export const MODALS_PUSH = 'modals/PUSH'
export const MODALS_REPLACE = 'modals/REPLACE'
export const MODALS_POP = 'modals/POP'
export const MODALS_CLEAR = 'modals/CLEAR'

export const DUCK_MODALS = 'modals'

export const modalsPush = ({ component, props }) => (dispatch) => dispatch({ type: MODALS_PUSH, component, props })

export const modalsReplace = ({ component, props }) => (dispatch) => dispatch({ type: MODALS_REPLACE, component, props })

export const modalsPop = () => (dispatch) => dispatch({ type: MODALS_POP })

export const modalsClear = () => (dispatch) => dispatch({ type: MODALS_CLEAR })

export const modalsClose = modalsPop
export const modalsOpen = modalsPush
export const modalsShow = modalsPush

export const modalsOpenConfirmDialog = ({ props }) => (dispatch) => dispatch({ type: MODALS_PUSH, component: ConfirmTxDialogNew, props })
