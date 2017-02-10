import AppDAO from '../../dao/AppDAO';

const CBE_ADD_SUCCESS = 'settings/CBE_ADD_SUCCESS';
const CBE_ADD_ERROR = 'settings/CBE_ADD_ERROR';

const initialState = {
    error: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case CBE_ADD_SUCCESS:
            return {
                ...state,
                error: false
            };
        case CBE_ADD_ERROR:
            return {
                ...state,
                error: true
            };
        default:
            return state;
    }
};

const addCBE = (address, account) => (dispatch) => {
    AppDAO.addCBE(address, account).then(r => {
        if (r) {
            dispatch({type: CBE_ADD_SUCCESS})
        } else {
            dispatch({type: CBE_ADD_ERROR})
        }
    });
};

export {
    addCBE
}

export default reducer;