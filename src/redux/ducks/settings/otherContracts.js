import {Map} from 'immutable';
import AppDAO from '../../../dao/AppDAO';
import DefaultContractModel from '../../../models/contracts/RewardsContractModel'; // any child of AbstractOtherContractModel

export const OTHER_CONTRACTS_LIST = 'settings/OTHER_CONTRACTS_LIST';
export const OTHER_CONTRACTS_REMOVE_TOGGLE = 'settings/OTHER_CONTRACTS_REMOVE_TOGGLE';

const initialState = {
    list: new Map(),
    selected: new DefaultContractModel(),
    error: false,
    remove: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case OTHER_CONTRACTS_LIST:
            return {
                ...state,
                list: action.list
            };
        case OTHER_CONTRACTS_REMOVE_TOGGLE:
            return {
                ...state,
                selected: action.contract === null ? new DefaultContractModel() : action.contract,
                remove: action.contract != null
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

const removeContractToggle = (contract: AbstractOtherContractModel = null) => ({
    type: OTHER_CONTRACTS_REMOVE_TOGGLE,
    contract
});

const removeContract = (contract: AbstractOtherContractModel) => (dispatch) => {
    dispatch(removeContractToggle(null));
    // TODO
};

export {
    listContracts,
    removeContractToggle,
    removeContract
}

export default reducer;