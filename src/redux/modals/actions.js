export const MODALS_PUSH = 'modals/PUSH'
export const MODALS_REPLACE = 'modals/REPLACE'
export const MODALS_POP = 'modals/POP'
export const MODALS_CLEAR = 'modals/CLEAR'

export const modalsPush = ({component, props}) => (dispatch) => {
  return dispatch({type: MODALS_PUSH, component, props})
}

export const modalsReplace = ({component, props}) => (dispatch) => {
  return dispatch({type: MODALS_REPLACE, component, props})
}

export const modalsPop = () => (dispatch) => {
  return dispatch({type: MODALS_POP})
}

export const modalsClear = () => (dispatch) => {
  return dispatch({type: MODALS_CLEAR})
}

export const modalsClose = modalsPop
export const modalsOpen = modalsPush
export const modalsShow = modalsPush
