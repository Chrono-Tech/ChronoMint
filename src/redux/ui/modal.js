export const MODAL_SHOW = 'modal/SHOW'
export const MODAL_HIDE = 'modal/HIDE'

export const ALERT_TYPE = 'modals/ALERT_TYPE'
export const LOC_TYPE = 'modals/LOC_TYPE'
export const SEND_TO_EXCHANGE_TYPE = 'modals/SEND_TO_EXCHANGE_TYPE'
export const ISSUE_LH_TYPE = 'modals/ISSUE_LH_TYPE'
export const REDEEM_LH_TYPE = 'modals/REDEEM_LH_TYPE'
export const UPLOADED_FILE_TYPE = 'modals/UPLOADED_FILE_TYPE'
export const NEW_POLL_TYPE = 'modals/NEW_POLL_TYPE'
export const POLL_TYPE = 'modals/POLL_TYPE'
export const DEPOSIT_TIME_TYPE = 'modals/DEPOSIT_TIME_TYPE'
export const SETTINGS_CBE_TYPE = 'modals/SETTINGS_CBE_TYPE'
export const SETTINGS_TOKEN_VIEW_TYPE = 'modals/SETTINGS_TOKEN_VIEW_TYPE'
export const SETTINGS_TOKEN_TYPE = 'modals/SETTINGS_TOKEN_TYPE'
export const SETTINGS_OTHER_CONTRACT_TYPE = 'modals/SETTINGS_OTHER_CONTRACT_TYPE'
export const SETTINGS_OTHER_CONTRACT_MODIFY_TYPE = 'modals/SETTINGS_OTHER_CONTRACT_MODIFY_TYPE'

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

export const showAlertModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: ALERT_TYPE, modalProps}))
}

export const showLOCModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: LOC_TYPE, modalProps}))
}

export const showSendToExchangeModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: SEND_TO_EXCHANGE_TYPE, modalProps}))
}

export const showIssueLHModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: ISSUE_LH_TYPE, modalProps}))
}

export const showRedeemLHModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: REDEEM_LH_TYPE, modalProps}))
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

export const showSettingsCBEModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: SETTINGS_CBE_TYPE, modalProps}))
}

export const showSettingsTokenViewModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: SETTINGS_TOKEN_VIEW_TYPE, modalProps}))
}

export const showSettingsTokenModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: SETTINGS_TOKEN_TYPE, modalProps}))
}

export const showSettingsOtherContractModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: SETTINGS_OTHER_CONTRACT_TYPE, modalProps}))
}

export const showSettingsOtherContractModifyModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: SETTINGS_OTHER_CONTRACT_MODIFY_TYPE, modalProps}))
}
