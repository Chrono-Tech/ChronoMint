import {
    REWARDS_LOAD_START,
    REWARDS_LOAD_SUCCESS
} from './reducer';

const initialState = {
    isFetching: false,
    error: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case REWARDS_LOAD_START:
            return {
                isFetching: true,
                error: null
            };
        case REWARDS_LOAD_SUCCESS:
            return {
                isFetching: false,
                error: null
            };
        default:
            return state;
    }
};

export default reducer;