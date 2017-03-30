export const MODAL_SHOW = 'modal/SHOW';
export const MODAL_HIDE = 'modal/HIDE';

export const PROMPT_TYPE = 'modals/PROMPT_TYPE';
export const ALERT_TYPE = 'modals/ALERT_TYPE';
export const LOC_TYPE = 'modals/LOC_TYPE';
export const SIGNATURES_NUMBER_TYPE = 'modals/SIGNATURES_NUMBER_TYPE';
export const ISSUE_LH_TYPE = 'modals/ISSUE_LH_TYPE';
export const UPLOADED_FILE_TYPE = 'modals/UPLOADED_FILE_TYPE';
export const NEW_POLL_TYPE = 'modals/NEW_POLL_TYPE';
export const POLL_TYPE = 'modals/POLL_TYPE';
export const DEPOSIT_TIME_TYPE = 'modals/DEPOSIT_TIME_TYPE';
export const SETTINGS_CBE_TYPE = 'modals/SETTINGS_CBE_TYPE';
export const SETTINGS_TOKEN_VIEW_TYPE = 'modals/SETTINGS_TOKEN_VIEW_TYPE';
export const SETTINGS_TOKEN_TYPE = 'modals/SETTINGS_TOKEN_TYPE';
export const SETTINGS_OTHER_CONTRACT_TYPE = 'modals/SETTINGS_OTHER_CONTRACT_TYPE';
export const SETTINGS_OTHER_CONTRACT_MODIFY_TYPE = 'modals/SETTINGS_OTHER_CONTRACT_MODIFY_TYPE';
export const IPFS_TYPE = 'modals/IPFS_TYPE';
export const REWARDS_TYPE = 'modals/REWARDS_TYPE';

const initialState = {
  open: false,
  modalType: null,
  modalProps: {}
}

const reducer = (state = initialState, action) => {
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

const showModal = (payload) => ({type: MODAL_SHOW, payload})
const hideModal = () => ({type: MODAL_HIDE})

const showPromptModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: PROMPT_TYPE, modalProps}))
}

const showAlertModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: ALERT_TYPE, modalProps}))
}

const showLOCModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: LOC_TYPE, modalProps}))
}

const showChangeNumberSignaturesModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: SIGNATURES_NUMBER_TYPE, modalProps}))
}

const showIssueLHModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: ISSUE_LH_TYPE, modalProps}))
}

const showUploadedFileModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: UPLOADED_FILE_TYPE, modalProps}))
}

const showNewPollModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: NEW_POLL_TYPE, modalProps}))
}

const showPollModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: POLL_TYPE, modalProps}))
}

const showDepositTimeModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: DEPOSIT_TIME_TYPE, modalProps}));
};

const showSettingsCBEModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: SETTINGS_CBE_TYPE, modalProps}))
}

const showSettingsTokenViewModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: SETTINGS_TOKEN_VIEW_TYPE, modalProps}))
}

const showSettingsTokenModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: SETTINGS_TOKEN_TYPE, modalProps}))
}

const showSettingsOtherContractModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: SETTINGS_OTHER_CONTRACT_TYPE, modalProps}))
}

const showSettingsOtherContractModifyModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: SETTINGS_OTHER_CONTRACT_MODIFY_TYPE, modalProps}))
}

const showIPFSModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: IPFS_TYPE, modalProps}))
}

const showRewardsEnablingModal = (modalProps) => (dispatch) => {
  dispatch(showModal({modalType: REWARDS_TYPE, modalProps}))
}

export {
  showModal,
  hideModal,
  showPromptModal,
  showAlertModal,
  showLOCModal,
  showChangeNumberSignaturesModal,
  showIssueLHModal,
  showUploadedFileModal,
  showNewPollModal,
  showPollModal,
  showDepositTimeModal,
  showSettingsCBEModal,
  showSettingsTokenViewModal,
  showSettingsTokenModal,
  showSettingsOtherContractModal,
  showSettingsOtherContractModifyModal,
  showIPFSModal,
  showRewardsEnablingModal
}

export default reducer;
