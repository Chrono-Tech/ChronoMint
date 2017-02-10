import CBEAddressDAO from '../../dao/CBEAddressDAO';

const ADD_SUCCESS = 'cbe/ADD_SUCCESS';
const ADD_ERROR = 'cbe/ADD_ERROR';

const initialState = {
    error: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_SUCCESS:
            return {
                ...state,
                // TODO
            };
        case ADD_ERROR:
            return {
                ...state,
                error: null // TODO
            };
        default:
            return state;
    }
};

const addAddress = (address) => (dispatch) => {
    CBEAddressDAO.add(address).then(r => {
        if (r) {
            dispatch({type: ADD_SUCCESS})
        } else {
            dispatch({type: ADD_ERROR})
        }
    });
};

export {
    addAddress
}

export default reducer;