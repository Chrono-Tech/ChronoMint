import {
    PENDINGS_LOADING,
    PENDINGS_LOADED,
} from './actions';

const initialState = {
    isFetching: false,
    error: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case PENDINGS_LOADING:
            return {
                isFetching: true,
                error: null
            };
        case PENDINGS_LOADED:
            return {
                isFetching: false,
                error: null
            };
        default:
            return state;
    }
};

export default reducer;