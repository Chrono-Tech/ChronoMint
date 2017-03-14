import {Map} from 'immutable';
import {showSettingsOtherContractModal, showSettingsOtherContractModifyModal} from '../../../redux/ducks/ui/modal';
import AppDAO from '../../../dao/AppDAO';
import OtherContractsDAO from '../../../dao/OtherContractsDAO';
import AbstractOtherContractModel from '../../../models/contracts/AbstractOtherContractModel';
import DefaultContractModel from '../../../models/contracts/RewardsContractModel'; // any child of AbstractOtherContractModel
import OtherContractNoticeModel from '../../../models/notices/OtherContractNoticeModel';
import {notify} from '../notifier/notifier';

export const OTHER_CONTRACTS_LIST = 'settings/OTHER_CONTRACTS_LIST';
export const OTHER_CONTRACTS_FORM = 'settings/OTHER_CONTRACTS_FORM';
export const OTHER_CONTRACTS_UPDATE = 'settings/OTHER_CONTRACTS_UPDATE';
export const OTHER_CONTRACTS_REMOVE = 'settings/OTHER_CONTRACTS_REMOVE';
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
        case OTHER_CONTRACTS_UPDATE:
            return {
                ...state,
                list: state.list.set(action.contract.address(), action.contract)
            };
        case OTHER_CONTRACTS_REMOVE:
            return {
                ...state,
                list: state.list.delete(action.contract.address())
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
                error: action.address
            };
        case OTHER_CONTRACTS_HIDE_ERROR:
            return {
                ...state,
                error: false
            };
        default:
            return state;
    }
};

const showContractForm = (contract: AbstractOtherContractModel) => ({type: OTHER_CONTRACTS_FORM, contract});
const showContractError = (address: string) => ({type: OTHER_CONTRACTS_ERROR, address});
const hideContractError = () => ({type: OTHER_CONTRACTS_HIDE_ERROR});
const removeContractToggle = (contract: AbstractOtherContractModel = null) => ({
    type: OTHER_CONTRACTS_REMOVE_TOGGLE,
    contract
});

const listContracts = () => (dispatch) => {
    return OtherContractsDAO.getList().then(list => {
        dispatch({type: OTHER_CONTRACTS_LIST, list});
    });
};

const formContract = (contract: AbstractOtherContractModel) => (dispatch) => {
    dispatch(showContractForm(contract));
    dispatch(showSettingsOtherContractModal());
};

const formModifyContract = (contract: AbstractOtherContractModel) => (dispatch) => {
    return AppDAO.initDAO(contract.dao(), contract.address()).then(dao => {
        return dao.retrieveSettings().then(settings => {
            dispatch(showContractForm(contract.set('settings', settings)));
            dispatch(showSettingsOtherContractModifyModal());
        });
    });
};

const addContract = (address: string, account) => (dispatch) => {
    return OtherContractsDAO.add(address, account).then(result => {
        if (!result) { // success result will be watched so we need to process only false
            dispatch(showContractError(address));
        }
    });
};

const saveContractSettings = (contract: AbstractOtherContractModel, account) => (dispatch) => {
    return AppDAO.initDAO(contract.dao(), contract.address()).then(dao => {
        return dao.saveSettings(contract, account).then(result => {
            if (!result) {
                dispatch(showContractError(contract.address()));
            }
        });
    });
};

const removeContract = (contract: AbstractOtherContractModel, account) => (dispatch) => {
    dispatch(removeContractToggle(null));
    return OtherContractsDAO.remove(contract, account).then(r => {
        if (!r) { // success result will be watched so we need to process only false
            dispatch(showContractError(contract.address()));
        }
    });
};

const watchUpdateContract = (contract: AbstractOtherContractModel, time, revoke) => (dispatch) => {
    dispatch(notify(new OtherContractNoticeModel({time, contract, revoke})));
    dispatch({type: revoke ? OTHER_CONTRACTS_REMOVE : OTHER_CONTRACTS_UPDATE, contract});
};

export {
    listContracts,
    formContract,
    formModifyContract,
    addContract,
    saveContractSettings,
    removeContractToggle,
    removeContract,
    showContractForm,
    showContractError,
    hideContractError,
    watchUpdateContract
}

export default reducer;