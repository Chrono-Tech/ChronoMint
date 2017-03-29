import {SESSION_CREATE_START} from '../../session/actions';

export const OPERATIONS_PROPS_LOAD_START = 'operationsProps/LOAD_START';
export const OPERATIONS_PROPS_LOAD_SUCCESS = 'operationsProps/LOAD_SUCCESS';

const initialState = {
    isFetching: false,
    error: null,
    isReady: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SESSION_CREATE_START:
            return initialState;
        case OPERATIONS_PROPS_LOAD_START:
            return {
                ...state,
                isFetching: true,
                isReady: false
            };
        case OPERATIONS_PROPS_LOAD_SUCCESS:
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