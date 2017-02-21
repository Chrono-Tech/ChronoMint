import {
    SESSION_CREATE_START,
    SESSION_CREATE_SUCCESS,
    SESSION_DESTROY
} from './actions';

const initialState = {
    isFetching: false,
    error: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SESSION_CREATE_START:
            return {
                isFetching: true,
                error: null
            };
        case SESSION_CREATE_SUCCESS:
            return {
                isFetching: false,
                error: null
            };
        case SESSION_DESTROY:
            return initialState;
        default:
            return state;
    }
};

export default reducer;