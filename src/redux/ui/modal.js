import { modalsOpen } from '../modals/actions'
import ConfirmTxDialog from '../../components/dialogs/ConfirmTxDialog/ConfirmTxDialog'

export const MODAL_SHOW = 'modal/SHOW'
export const MODAL_HIDE = 'modal/HIDE'

export const ALERT_TYPE = 'modals/ALERT'
export const CONFIRM_TYPE = 'modals/CONFIRM'

export const LOC_TYPE = 'modals/LOC'
export const LOC_STATUS_TYPE = 'modals/LOC_STATUS'
export const LOC_ISSUE_TYPE = 'modals/LOC_ISSUE'
export const LOC_REDEEM_TYPE = 'modals/LOC_REDEEM'
export const SEND_TO_EXCHANGE_TYPE = 'modals/SEND_TO_EXCHANGE'

export const UPLOADED_FILE_TYPE = 'modals/UPLOADED_FILE'
export const NEW_POLL_TYPE = 'modals/NEW_POLL'
export const POLL_TYPE = 'modals/POLL'
export const OPERATIONS_SETTINGS_TYPE = 'modals/OPERATIONS_SETTINGS'
export const DEPOSIT_TIME_TYPE = 'modals/DEPOSIT_TIME'
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

export const showConfirmTxModal = (modalProps) => (dispatch) => {
  return new Promise(resolve => {
    dispatch(modalsOpen({
      component: ConfirmTxDialog,
      props: {
        ...modalProps,
        callback: (isConfirmed) => resolve(isConfirmed)
      }
    }))
  }).catch(e => {
    // eslint-disable-next-line
    console.error('Confirm modal error:', e)
    return false
  })
}

export const showAlertModal = (modalProps) => (dispatch) => { // TODO provide convenient signature and i18n
  dispatch(showModal({modalType: ALERT_TYPE, modalProps}))
}

export const showLOCModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: LOC_TYPE, modalProps}))
}

export const showLOCStatusModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: LOC_STATUS_TYPE, modalProps}))
}

export const showSendToExchangeModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: SEND_TO_EXCHANGE_TYPE, modalProps}))
}

export const showLOCIssueModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: LOC_ISSUE_TYPE, modalProps}))
}

export const showLOCRedeemModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: LOC_REDEEM_TYPE, modalProps}))
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

export const showDepositTIMEModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: DEPOSIT_TIME_TYPE, modalProps}))
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
