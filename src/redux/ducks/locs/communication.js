import {SESSION_CREATE_START} from '../session/constants';

export const LOCS_LOAD_START = 'locs/LOAD_START';
export const LOCS_LOAD_SUCCESS = 'locs/LOAD_SUCCESS';

const initialState = {
    isFetching: false,
    error: false,
    isReady: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SESSION_CREATE_START:
            return initialState;
        case LOCS_LOAD_START:
            return {
                ...state,
                isFetching: true,
            };
        case LOCS_LOAD_SUCCESS:
            return {
                ...state,
                isFetching: false,
                isReady: true
            };
        default:
            return state;
    }
};

export default reducer;