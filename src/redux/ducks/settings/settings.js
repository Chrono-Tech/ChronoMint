import {Map} from 'immutable';
import AppDAO from '../../../dao/AppDAO';
import CBEModel from '../../../models/CBEModel';
import {showCBEAddressModal} from '../../../redux/ducks/ui/modal';

const CBE_LIST = 'settings/CBE_LIST';
const CBE_FORM = 'settings/CBE_FORM';
const CBE_REMOVE_TOGGLE = 'settings/CBE_REMOVE_TOGGLE';
const CBE_REVOKE = 'settings/CBE_REVOKE';
const CBE_WATCH_UPDATE = 'settings/CBE_WATCH_UPDATE'; // for add purposes as well
const CBE_WATCH_REVOKE = 'settings/CBE_WATCH_REVOKE';
const CBE_ERROR = 'settings/CBE_ERROR'; // all - add & modify & remove
const CBE_HIDE_ERROR = 'settings/CBE_HIDE_ERROR';

const initialState = {
    cbe: {
        list: new Map,
        form: new CBEModel,
        error: false,
        removeCBE: new CBEModel
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
        case CBE_REMOVE_TOGGLE:
            return {
                ...state,
                cbe: {
                    ...state.cbe,
                    removeCBE: action.cbe
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
        case CBE_HIDE_ERROR:
            return {
                ...state,
                cbe: {
                    ...state.cbe,
                    error: false,
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

const removeCBEToggle = (cbe: CBEModel = null) => (dispatch) => {
    cbe = cbe == null ? new CBEModel : cbe;
    dispatch({type: CBE_REMOVE_TOGGLE, cbe});
};

const revokeCBE = (address, account) => (dispatch) => {
    dispatch(removeCBEToggle(null));
    AppDAO.revokeCBE(address, account).then(r => {
        if (!r) { // success result will be watched so we need to process only false
            dispatch({type: CBE_ERROR});
        }
    });
};

const watchUpdateCBE = (cbe: CBEModel) => ({type: CBE_WATCH_UPDATE, cbe});
const watchRevokeCBE = (address) => ({type: CBE_WATCH_REVOKE, address});
const hideError = () => ({type: CBE_HIDE_ERROR});

export {
    listCBE,
    formCBE,
    treatCBE,
    removeCBEToggle,
    revokeCBE,
    watchUpdateCBE,
    watchRevokeCBE,
    hideError
}

export default reducer;