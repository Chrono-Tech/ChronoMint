import {Map} from 'immutable';
import AppDAO from '../../../dao/AppDAO';

export const OTHER_CONTRACTS_LIST = 'settings/OTHER_CONTRACTS_LIST';

const initialState = {
    list: new Map()
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case OTHER_CONTRACTS_LIST:
            return {
                ...state,
                list: action.list
            };
        default:
            return state;
    }
};

const listContracts = () => (dispatch) => {
    return AppDAO.getOtherContracts().then(list => {
        dispatch({type: OTHER_CONTRACTS_LIST, list});
    });
};

export {
    listContracts
}

export default reducer;