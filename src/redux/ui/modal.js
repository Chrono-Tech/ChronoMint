import { modalsOpen } from 'redux/modals/actions'
import ConfirmTxDialog from 'components/dialogs/ConfirmTxDialog/ConfirmTxDialog'

export const MODAL_SHOW = 'modal/SHOW'
export const MODAL_HIDE = 'modal/HIDE'

export const ALERT_TYPE = 'modals/ALERT'
export const CONFIRM_TYPE = 'modals/CONFIRM'

export const SEND_TO_EXCHANGE_TYPE = 'modals/SEND_TO_EXCHANGE'

export const UPLOADED_FILE_TYPE = 'modals/UPLOADED_FILE'
export const NEW_POLL_TYPE = 'modals/NEW_POLL'
export const POLL_TYPE = 'modals/POLL'
export const OPERATIONS_SETTINGS_TYPE = 'modals/OPERATIONS_SETTINGS'
export const SETTINGS_CBE_TYPE = 'modals/SETTINGS_CBE'
export const SETTINGS_TOKEN_TYPE = 'modals/SETTINGS_TOKEN'

const initialState = {
  open: false,
  modalType: null,
  modalProps: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case MODAL_SHOW:
      return {
        ...action.payload,
        open: true
      }
    case MODAL_HIDE:
      return {
        ...state,
        open: false
      }
    default:
      return state
  }
}

export const showModal = (payload) => ({type: MODAL_SHOW, payload})
export const hideModal = () => ({type: MODAL_HIDE})

export const showConfirmTxModal = () => (dispatch) => {
  return new Promise(resolve => {
    dispatch(modalsOpen({
      component: ConfirmTxDialog,
      props: {
        callback: (isConfirmed) => resolve(isConfirmed)
      }
    }))
  }).catch(e => {
    // eslint-disable-next-line
    console.error('Confirm modal error:', e)
    return false
  })
}

// TODO provide convenient signature and i18n
export const showAlertModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: ALERT_TYPE, modalProps}))
}

export const showSendToExchangeModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: SEND_TO_EXCHANGE_TYPE, modalProps}))
}

export const showUploadedFileModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: UPLOADED_FILE_TYPE, modalProps}))
}

export const showNewPollModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: NEW_POLL_TYPE, modalProps}))
}

export const showPollModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: POLL_TYPE, modalProps}))
}

export const showOperationsSettingsModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: OPERATIONS_SETTINGS_TYPE, modalProps}))
}

export const showSettingsCBEModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: SETTINGS_CBE_TYPE, modalProps}))
}

export const showSettingsTokenModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: SETTINGS_TOKEN_TYPE, modalProps}))
}
