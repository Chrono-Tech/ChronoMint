const MODAL_SHOW = 'modal/SHOW';
const MODAL_HIDE = 'modal/HIDE';

const PROMPT_TYPE = 'modals/PROMPT_TYPE';
const LOC_TYPE = 'modals/LOC_TYPE';
const SETTINGS_CBE_TYPE = 'modals/SETTINGS_CBE_TYPE';
const SETTINGS_TOKEN_VIEW_TYPE = 'modals/SETTINGS_TOKEN_VIEW_TYPE';
const SETTINGS_TOKEN_TYPE = 'modals/SETTINGS_TOKEN_TYPE';
const IPFS_TYPE = 'modals/IPFS_TYPE';
const REWARDS_TYPE = 'modals/REWARDS_TYPE';

const initialState = {
    open: false,
    modalType: null,
    modalProps: {}
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case MODAL_SHOW:
            return {
                ...action.payload,
                open: true,
            };
        case MODAL_HIDE:
            return {
                ...state,
                open: false
            };
        default:
            return state;
    }
};

const showModal = (payload) => ({type: MODAL_SHOW, payload});
const hideModal = () => ({type: MODAL_HIDE});

const showPromptModal = (modalProps) => (dispatch) => {
    dispatch(showModal({modalType: PROMPT_TYPE, modalProps}));
};

const showLOCModal = (modalProps) => (dispatch) => {
    dispatch(showModal({modalType: LOC_TYPE, modalProps}));
};

const showSettingsCBEModal = (modalProps) => (dispatch) => {
    dispatch(showModal({modalType: SETTINGS_CBE_TYPE, modalProps}));
};

const showSettingsTokenViewModal = (modalProps) => (dispatch) => {
    dispatch(showModal({modalType: SETTINGS_TOKEN_VIEW_TYPE, modalProps}));
};

const showSettingsTokenModal = (modalProps) => (dispatch) => {
    dispatch(showModal({modalType: SETTINGS_TOKEN_TYPE, modalProps}));
};

const showIPFSModal = (modalProps) => (dispatch) => {
    dispatch(showModal({modalType: IPFS_TYPE, modalProps}));
};

const showRewardsEnablingModal = (modalProps) => (dispatch) => {
    dispatch(showModal({modalType: REWARDS_TYPE, modalProps}));
};

export {
    PROMPT_TYPE,
    LOC_TYPE,
    SETTINGS_CBE_TYPE,
    SETTINGS_TOKEN_VIEW_TYPE,
    SETTINGS_TOKEN_TYPE,
    IPFS_TYPE,
    REWARDS_TYPE,

    showModal,
    hideModal,
    showPromptModal,
    showLOCModal,
    showSettingsCBEModal,
    showSettingsTokenViewModal,
    showSettingsTokenModal,
    showIPFSModal,
    showRewardsEnablingModal
}

export default reducer;
