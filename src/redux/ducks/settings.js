import {Map} from 'immutable';
import AppDAO from '../../dao/AppDAO';
import CBEModel from '../../models/CBEModel';
import {showCBEAddressModal} from '../../redux/ducks/ui/modal';

const CBE_LIST = 'settings/CBE_LIST';
const CBE_FORM = 'settings/CBE_FORM';
const CBE_REVOKE = 'settings/CBE_REVOKE';
const CBE_WATCH_UPDATE = 'settings/CBE_WATCH_UPDATE'; // for add purposes as well
const CBE_WATCH_REVOKE = 'settings/CBE_WATCH_REVOKE';
const CBE_ERROR = 'settings/CBE_ERROR'; // all - add & modify & remove

const initialState = {
    cbe: {
        list: new Map(),
        form: new CBEModel(),
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
        case CBE_FORM:
            return {
                ...state,
                cbe: {
                    ...state.cbe,
                    form: action.cbe
                }
            };
        case CBE_WATCH_UPDATE:
            return {
                ...state,
                cbe: {
                    ...state.cbe,
                    list: state.cbe.list.set(action.cbe.address(), action.cbe)
                }
            };
        case CBE_WATCH_REVOKE:
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

const formCBE = (cbe: CBEModel) => (dispatch) => {
    dispatch({type: CBE_FORM, cbe});
    dispatch(showCBEAddressModal());
};

const treatCBE = (cbe: CBEModel, account) => (dispatch) => {
    AppDAO.treatCBE(cbe, account).then(r => {
        if (!r) { // success result will be watched so we need to process only false
            dispatch({type: CBE_ERROR});
        }
    });
};

const revokeCBE = (address, account) => (dispatch) => {
    AppDAO.revokeCBE(address, account).then(r => {
        if (!r) { // success result will be watched so we need to process only false
            dispatch({type: CBE_ERROR});
        }
    });
};

const watchUpdateCBE = (cbe: CBEModel) => ({type: CBE_WATCH_UPDATE, cbe});
const watchRevokeCBE = (address) => ({type: CBE_WATCH_REVOKE, address});

export {
    listCBE,
    formCBE,
    treatCBE,
    revokeCBE,
    watchUpdateCBE,
    watchRevokeCBE
}

export default reducer;