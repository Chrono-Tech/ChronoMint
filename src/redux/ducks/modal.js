const MODAL_SHOW = 'modal/SHOW';
const MODAL_HIDE = 'modal/HIDE';

const PROMPT_TYPE = 'modals/PROMPT_TYPE';

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

export {
    showModal,
    hideModal,
    showPromptModal
}

export default reducer;
