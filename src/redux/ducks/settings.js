import {Map} from 'immutable';
import AppDAO from '../../dao/AppDAO';

const CBE_LIST = 'settings/CBE_LIST';
const CBE_UPDATE = 'settings/CBE_UPDATE'; // for add purposes as well
const CBE_REVOKE = 'settings/CBE_REVOKE';
const CBE_ERROR = 'settings/CBE_ERROR'; // add & modify & remove

const initialState = {
    cbe: {
        list: new Map(),
        error: false
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case CBE_LIST:
            return {
                ...state,
                cbe: {
                    ...state.cbe,
                    list: action.list
                }
            };
        case CBE_UPDATE:
            return {
                ...state,
                cbe: {
                    ...state.cbe,
                    list: state.cbe.list.set(action.cbe.address(), action.cbe)
                }
            };
        case CBE_REVOKE:
            return {
                ...state,
                cbe: {
                    ...state.cbe,
                    list: state.cbe.list.delete(action.address)
                }
            };
        case CBE_ERROR:
            return {
                ...state,
                cbe: {
                    ...state.cbe,
                    error: true,
                }
            };
        default:
            return state;
    }
};

const listCBE = (account) => (dispatch) => {
    AppDAO.getCBEs(account).then(CBEs => {
        dispatch({type: CBE_LIST, list: CBEs});
    });
};

const addCBE = (address, account) => (dispatch) => {
    AppDAO.addCBE(address, account).then(r => {
        if (!r) { // success result will be watched so we need to process only false
            dispatch({type: CBE_ERROR})
        }
    });
};

const updateCBE = (cbe: CBEModel) => ({type: CBE_UPDATE, cbe});
const revokeCBE = (address) => ({type: CBE_REVOKE, address});

export {
    addCBE,
    listCBE,
    updateCBE,
    revokeCBE
}

export default reducer;