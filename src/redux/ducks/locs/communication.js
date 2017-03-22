import {SESSION_CREATE_START} from '../session/constants';

export const LOCS_FETCH_START = 'locs/LOAD_START';
export const LOCS_FETCH_END = 'locs/LOAD_SUCCESS';

const initialState = {
    isFetching: false,
    error: false,
    isReady: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SESSION_CREATE_START:
            return initialState;
        case LOCS_FETCH_START:
            return {
                ...state,
                isFetching: true,
            };
        case LOCS_FETCH_END:
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