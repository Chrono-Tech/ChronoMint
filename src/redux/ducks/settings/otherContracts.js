import {Map} from 'immutable';
import AppDAO from '../../../dao/AppDAO';

const OTHER_CONTRACTS_LIST = 'settings/OTHER_CONTRACTS_LIST';

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
    let list = new Map();
    AppDAO.getOtherContracts((contract, total) => {
        list = list.set(contract.address(), contract);
        if (list.size === total) {
            dispatch({type: OTHER_CONTRACTS_LIST, list});
        }
    });
};

export {
    listContracts
}

export default reducer;