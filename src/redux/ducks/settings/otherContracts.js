import {Map} from 'immutable';
import {showSettingsOtherContractModal} from '../../../redux/ducks/ui/modal';
import AppDAO from '../../../dao/AppDAO';
import AbstractOtherContractModel from '../../../models/contracts/AbstractOtherContractModel';
import DefaultContractModel from '../../../models/contracts/RewardsContractModel'; // any child of AbstractOtherContractModel

export const OTHER_CONTRACTS_LIST = 'settings/OTHER_CONTRACTS_LIST';
export const OTHER_CONTRACTS_FORM = 'settings/OTHER_CONTRACTS_FORM';
export const OTHER_CONTRACTS_REMOVE_TOGGLE = 'settings/OTHER_CONTRACTS_REMOVE_TOGGLE';
export const OTHER_CONTRACTS_ERROR = 'settings/OTHER_CONTRACTS_ERROR'; // all - add & modify & remove
export const OTHER_CONTRACTS_HIDE_ERROR = 'settings/OTHER_CONTRACTS_HIDE_ERROR';

const initialState = {
    list: new Map(),
    ready: false,
    selected: new DefaultContractModel(),
    error: false,
    remove: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case OTHER_CONTRACTS_LIST:
            return {
                ...state,
                list: action.list,
                ready: true
            };
        case OTHER_CONTRACTS_FORM:
            return {
                ...state,
                selected: action.contract
            };
        case OTHER_CONTRACTS_REMOVE_TOGGLE:
            return {
                ...state,
                selected: action.contract === null ? new DefaultContractModel() : action.contract,
                remove: action.contract != null
            };
        case OTHER_CONTRACTS_ERROR:
            return {
                ...state,
                error: true,
            };
        case OTHER_CONTRACTS_HIDE_ERROR:
            return {
                ...state,
                error: false,
            };
        default:
            return state;
    }
};

const showContractsError = () => ({type: OTHER_CONTRACTS_ERROR});
const hideContractsError = () => ({type: OTHER_CONTRACTS_HIDE_ERROR});

const listContracts = () => (dispatch) => {
    return AppDAO.getOtherContracts().then(list => {
        dispatch({type: OTHER_CONTRACTS_LIST, list});
    });
};

const formContract = (contract: AbstractOtherContractModel) => (dispatch) => {
    dispatch({type: OTHER_CONTRACTS_FORM, contract});
    dispatch(showSettingsOtherContractModal());
};

const removeContractToggle = (contract: AbstractOtherContractModel = null) => ({
    type: OTHER_CONTRACTS_REMOVE_TOGGLE,
    contract
});

const removeContract = (contract: AbstractOtherContractModel, account) => (dispatch) => {
    dispatch(removeContractToggle(null));
    return AppDAO.removeOtherContract(contract, account).then(r => {
        if (!r) { // success result will be watched so we need to process only false
            dispatch(showContractsError());
        }
    });
};

export {
    listContracts,
    formContract,
    removeContractToggle,
    removeContract,
    showContractsError,
    hideContractsError
}

export default reducer;