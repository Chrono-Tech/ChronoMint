import {SESSION_CREATE_START} from '../session/constants';

export const CONFIRMATIONS_LOAD_START = 'confirmations/LOAD_START';
export const CONFIRMATIONS_LOAD_SUCCESS = 'confirmations/LOAD_SUCCESS';

const initialState = {
    isFetching: false,
    error: null,
    isNeedReload: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SESSION_CREATE_START:
            return {
                ...initialState,
                isNeedReload: true
            };
        case CONFIRMATIONS_LOAD_START:
            return {
                ...state,
                isFetching: true,
                error: null,
                isNeedReload: false
            };
        case CONFIRMATIONS_LOAD_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: null,
                isNeedReload: false
            };
        default:
            return state;
    }
};

export default reducer;