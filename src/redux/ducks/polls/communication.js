import {SESSION_CREATE_START} from '../session/constants';

export const POLLS_LOAD_START = 'polls/LOAD_START';
export const POLLS_LOAD_SUCCESS = 'polls/LOAD_SUCCESS';

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
        case POLLS_LOAD_START:
            return {
                ...state,
                isFetching: true,
                error: null,
                isNeedReload: false
            };
        case POLLS_LOAD_SUCCESS:
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