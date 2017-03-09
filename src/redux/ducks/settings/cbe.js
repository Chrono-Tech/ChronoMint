import {Map} from 'immutable';
import AppDAO from '../../../dao/AppDAO';
import CBEModel from '../../../models/CBEModel';
import {showSettingsCBEModal} from '../ui/modal';
import {notify} from '../notifier/notifier';
import {loadUserProfile} from '../session/data';
import CBENoticeModel from '../../../models/notices/CBENoticeModel';

export const CBE_LIST = 'settings/CBE_LIST';
export const CBE_FORM = 'settings/CBE_FORM';
export const CBE_REMOVE_TOGGLE = 'settings/CBE_REMOVE_TOGGLE';
export const CBE_UPDATE = 'settings/CBE_UPDATE'; // for add purposes as well
export const CBE_REMOVE = 'settings/CBE_REMOVE';
export const CBE_ERROR = 'settings/CBE_ERROR'; // all - add & modify & remove
export const CBE_HIDE_ERROR = 'settings/CBE_HIDE_ERROR';

const initialState = {
    list: new Map(),
    selected: new CBEModel(),
    error: false,
    remove: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case CBE_LIST:
            return {
                ...state,
                list: action.list
            };
        case CBE_FORM:
            return {
                ...state,
                selected: action.cbe
            };
        case CBE_REMOVE_TOGGLE:
            return {
                ...state,
                selected: action.cbe === null ? new CBEModel() : action.cbe,
                remove: action.cbe != null
            };
        case CBE_UPDATE:
            return {
                ...state,
                list: state.list.set(action.cbe.address(), action.cbe)
            };
        case CBE_REMOVE:
            return {
                ...state,
                list: state.list.delete(action.cbe.address())
            };
        case CBE_ERROR:
            return {
                ...state,
                error: true,
            };
        case CBE_HIDE_ERROR:
            return {
                ...state,
                error: false,
            };
        default:
            return state;
    }
};

const showCBEError = () => ({type: CBE_ERROR});
const hideCBEError = () => ({type: CBE_HIDE_ERROR});
const removeCBEToggle = (cbe: CBEModel = null) => ({type: CBE_REMOVE_TOGGLE, cbe});
const updateCBE = (cbe: CBEModel) => ({type: CBE_UPDATE, cbe});
const removeCBE = (cbe: CBEModel) => ({type: CBE_REMOVE, cbe});

const listCBE = () => (dispatch) => {
    return AppDAO.getCBEs().then(list => {
        dispatch({type: CBE_LIST, list})
    });
};

const formCBE = (cbe: CBEModel) => (dispatch) => {
    dispatch({type: CBE_FORM, cbe});
    dispatch(showSettingsCBEModal());
};

const treatCBE = (cbe: CBEModel, account) => (dispatch) => {
    return AppDAO.treatCBE(cbe, account).then(r => {
        if (!r) {
            dispatch(showCBEError());
        }
        if (r instanceof CBEModel) { // if modified only name
            dispatch(updateCBE(r));

            if (localStorage.getItem('chronoBankAccount') === r.address()) {
                dispatch(loadUserProfile(r.user()));
            }
        }
    });
};

const revokeCBE = (cbe: CBEModel, account) => (dispatch) => {
    dispatch(removeCBEToggle(null));
    return AppDAO.revokeCBE(cbe, account).then(r => {
        if (!r) { // success result will be watched so we need to process only false
            dispatch(showCBEError());
        }
    });
};

const watchUpdateCBE = (cbe: CBEModel, time, revoke) => (dispatch) => {
    dispatch(notify(new CBENoticeModel({time, cbe, revoke})));
    dispatch(revoke ? removeCBE(cbe) : updateCBE(cbe));
};

export {
    listCBE,
    formCBE,
    treatCBE,
    removeCBEToggle,
    revokeCBE,
    watchUpdateCBE,
    updateCBE,
    removeCBE,
    showCBEError,
    hideCBEError
}

export default reducer;