import {Map} from 'immutable';
import AppDAO from '../../../dao/AppDAO';
import CBEModel from '../../../models/CBEModel';
import {showSettingsCBEModal} from '../../../redux/ducks/ui/modal';
import {notify} from '../../../redux/ducks/notifier/notifier';
import CBENoticeModel from '../../../models/notices/CBENoticeModel';

export const CBE_LIST = 'settings/CBE_LIST';
export const CBE_FORM = 'settings/CBE_FORM';
export const CBE_REMOVE_TOGGLE = 'settings/CBE_REMOVE_TOGGLE';
export const CBE_WATCH_UPDATE = 'settings/CBE_WATCH_UPDATE'; // for add purposes as well
export const CBE_WATCH_REVOKE = 'settings/CBE_WATCH_REVOKE';
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
                selected: action.cbe == null ? new CBEModel() : action.cbe,
                remove: action.cbe != null
            };
        case CBE_WATCH_UPDATE:
            return {
                ...state,
                list: state.list.set(action.cbe.address(), action.cbe)
            };
        case CBE_WATCH_REVOKE:
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

const showError = () => ({type: CBE_ERROR});
const removeCBEToggle = (cbe: CBEModel = null) => ({type: CBE_REMOVE_TOGGLE, cbe});

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
        if (!r) { // success result will be watched so we need to process only false
            dispatch(showError());
        }
    });
};

const revokeCBE = (cbe: CBEModel, account) => (dispatch) => {
    dispatch(removeCBEToggle(null));
    return AppDAO.revokeCBE(cbe, account).then(r => {
        if (!r) { // success result will be watched so we need to process only false
            dispatch(showError());
        }
    });
};

const watchUpdateCBE = (cbe: CBEModel, time) => (dispatch) => {
    dispatch(notify(new CBENoticeModel({time, cbe})));
    dispatch({type: CBE_WATCH_UPDATE, cbe});
};

const watchRevokeCBE = (cbe: CBEModel, time) => (dispatch) => {
    dispatch(notify(new CBENoticeModel({time, cbe, revoke: true})));
    dispatch({type: CBE_WATCH_REVOKE, cbe});
};

const hideError = () => ({type: CBE_HIDE_ERROR});

export {
    listCBE,
    formCBE,
    treatCBE,
    removeCBEToggle,
    revokeCBE,
    watchUpdateCBE,
    watchRevokeCBE,
    showError,
    hideError
}

export default reducer;