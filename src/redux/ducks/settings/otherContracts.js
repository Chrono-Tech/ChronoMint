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
    let list = new Map();
    return new Promise(resolve => {
        AppDAO.getOtherContracts((contract, total) => {
            total--;// TODO Remove this and if below when ContractsManager will be fixed MINT-53
            if (list.get(contract.address())) {
                return;
            }

            list = list.set(contract.address(), contract);
            if (list.size === total) {
                dispatch({type: OTHER_CONTRACTS_LIST, list});
                resolve();
            }
        });
    });
};

export {
    listContracts
}

export default reducer;