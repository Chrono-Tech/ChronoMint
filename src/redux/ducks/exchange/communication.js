import {
    EXCHANGE_RATES_LOAD_START,
    EXCHANGE_RATES_LOAD_SUCCESS
} from './data';

const initialState = {
    isFetching: false,
    error: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case EXCHANGE_RATES_LOAD_START:
            return {
                isFetching: true,
                error: null
            };
        case EXCHANGE_RATES_LOAD_SUCCESS:
            return {
                isFetching: false,
                error: null
            };
        default:
            return state;
    }
};

export default reducer;