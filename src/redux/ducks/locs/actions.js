import AppDAO from '../../../dao/AppDAO';
import LOCsManagerDAO from '../../../dao/LOCsManagerDAO';
import {notify} from '../../../redux/ducks/notifier/notifier';
import NoticeModel from '../../../models/notices/NoticeModel';
import LOCNoticeModel from '../../../models/notices/LOCNoticeModel';
import LOCModel from '../../../models/LOCModel';
import {LOCS_LOAD_START, LOCS_LOAD_SUCCESS} from './communication';
import { createAllLOCsAction, createLOCAction, updateLOCAction , removeLOCAction } from './reducer';

const locsLoadStartAction = () => ({type: LOCS_LOAD_START});
const locsLoadSuccessAction = (payload) => ({type: LOCS_LOAD_SUCCESS, payload});

const updateLOC = (data) => (dispatch, getState) => {
    const loc = getState().get('locs').get(data.address);
    return LOCsManagerDAO.updateLOC(data, data.account).then( (r) => {
        if (r === true){
            dispatch(notify(new LOCNoticeModel({loc, message: 'Will be updated.'})));
            // dispatch(notify(new NoticeModel({message: 'LOC updated'})))
        } else {
            dispatch(notify(new LOCNoticeModel({loc, message: 'not updated.'})));
            // dispatch(notify(new NoticeModel({message: 'LOC not updated'})))
        }
        return r;
    });
};

const issueLH = (data) => (dispatch) => {
    const {account, issueAmount, locAddress, issued} = data;
    return AppDAO.reissueAsset('LHT', issueAmount, account, locAddress).then(r => {
        if (!r) {
            dispatch(notify(new NoticeModel({message: 'LH not issued'})));
            return false
        }
        dispatch(notify(new NoticeModel({message: 'LH issued successfully'})));
        LOCsManagerDAO.updateLOC({issued, account, locAddress}, account);
        return true;
    });
};

const proposeLOC = (props) => (dispatch) => {
    let {locName, website, issueLimit, publishedHash, expDate, account} = props;
    return LOCsManagerDAO.proposeLOC(locName, website, issueLimit, publishedHash, expDate, account).then(r => {
        if (!r) {
            dispatch(notify(new NoticeModel({message: 'LOC not proposed'})));
            return false
        }
        dispatch(notify(new LOCNoticeModel({loc: new LOCModel(props), message: 'proposed successfully.'})))
        return true;
    });
};

const removeLOC = (address) => (dispatch, getState) => {
    const loc = getState().get('locs').get(address);
    return LOCsManagerDAO.removeLOC(address, localStorage.getItem('chronoBankAccount')).then(r => {
        if (!r) {
            dispatch(notify(new LOCNoticeModel({loc, message: 'Not removed.'})))
            return false
        }
        dispatch(notify(new LOCNoticeModel({loc, message: 'Will be removed.'})))
        return true;
    });
};

const handleNewLOC = (locModel) => (dispatch) => {
    dispatch(createLOCAction(locModel));
    dispatch(notify(new LOCNoticeModel({loc: locModel, message: 'Was added.'})))
};

const handleRemoveLoc = (address) => (dispatch, getState) => {
    const loc = getState().get('locs').get(address);
    dispatch(removeLOCAction({address}));
    dispatch(notify(new LOCNoticeModel({loc, message: 'Removed successfully.'})))
    // dispatch(notify(new NoticeModel({message: 'LOC removed successfully'})))
};

const handleUpdateLocStatus = (address, status) => (dispatch, getState) => {
    const loc = getState().get('locs').get(address);
    dispatch(updateLOCAction({valueName: 'status', value: status, address}));
    dispatch(notify(new LOCNoticeModel({loc, message: 'Updated. New status = ' + status})))
};

const handleUpdateLocValue = (address, valueName, value) => (dispatch, getState) => {
    const loc = getState().get('locs').get(address);
    dispatch(updateLOCAction({valueName, value, address}));
    dispatch(notify(new LOCNoticeModel({loc, message: 'Updated. New ' + valueName + ' = ' + value})))
};

const getLOCs = (account) => (dispatch) => {
    dispatch(locsLoadStartAction());
    LOCsManagerDAO.getLOCs(account).then( locs => {
        dispatch(createAllLOCsAction(locs));
        dispatch(locsLoadSuccessAction());
    });
};

export {
    proposeLOC,
    updateLOC,
    issueLH,
    removeLOC,
    handleNewLOC,
    handleRemoveLoc,
    handleUpdateLocStatus,
    handleUpdateLocValue,
    getLOCs
}