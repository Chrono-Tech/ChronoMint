import { modalsOpen } from 'redux/modals/actions'

import ConfirmTxDialog from 'components/dialogs/ConfirmTxDialog/ConfirmTxDialog'

export const MODAL_HIDE = 'modal/HIDE'

export const ALERT_TYPE = 'modals/ALERT'
export const CONFIRM_TYPE = 'modals/CONFIRM'

export const UPLOADED_FILE_TYPE = 'modals/UPLOADED_FILE'
export const POLL_TYPE = 'modals/POLL'

const initialState = {
  open: false,
  modalType: null,
  modalProps: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case MODAL_HIDE:
      return {
        ...state,
        open: false,
      }
    default:
      return state
  }
}

export const hideModal = () => ({ type: MODAL_HIDE })

export const showConfirmTxModal = () => (dispatch) => new Promise((resolve) => {
  dispatch(modalsOpen({
    component: ConfirmTxDialog,
    props: {
      callback: (isConfirmed) => resolve(isConfirmed),
    },
  }))
}).catch((e) => {
  // eslint-disable-next-line
    console.error('Confirm modal error:', e)
  return false
})
