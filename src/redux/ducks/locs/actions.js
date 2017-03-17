import AppDAO from '../../../dao/AppDAO';
import LocDAO from '../../../dao/LocDAO';
import {notify} from '../../../redux/ducks/notifier/notifier';
import LOCNoticeModel from '../../../models/notices/LOCNoticeModel';
import {LOCS_LOAD_START, LOCS_LOAD_SUCCESS} from './communication';
import { createAllLOCsAction, createLOCAction/*, updateLOCAction, removeLOCAction*/ } from './reducer';
import NoticeModel from '../../../models/notices/NoticeModel';

const locsLoadStartAction = () => ({type: LOCS_LOAD_START});
const locsLoadSuccessAction = (payload) => ({type: LOCS_LOAD_SUCCESS, payload});

const updateLOC = (data) => (dispatch) => {
    AppDAO.updateLOC(data, data.account).then( (r) => {
        if (r === true){
            dispatch(notify(new NoticeModel({message: 'LOC updated'})))
        } else {
            dispatch(notify(new NoticeModel({message: 'LOC not updated'})))
        }
        return r;
    });
};

const issueLH = (data) => (dispatch) => {
    const {account, issueAmount, locAddress, issued} = data;
    return AppDAO.reissueAsset('LHT', issueAmount, account, locAddress).then(r => {
        if (!r) {
            dispatch(notify(new NoticeModel({message: 'LH not issued'})))
            return false
        }
        dispatch(notify(new NoticeModel({message: 'LH issued successfully'})))
        AppDAO.updateLOC({issued, account, locAddress}, account);
        return true;
    });
};

const proposeLOC = (props) => (dispatch) => {
    let {locName, website, issueLimit, publishedHash, expDate, account} = props;
    AppDAO.proposeLOC(locName, website, issueLimit, publishedHash, expDate, account).then(r => {
        if (!r) {
            dispatch(notify(new NoticeModel({message: 'LOC not proposed'})))
            return false
        }
        dispatch(notify(new NoticeModel({message: 'LOC proposed successfully'})))
        return true;
    });
};

const removeLOC = (address) => (dispatch) => {
    AppDAO.removeLOC(address, localStorage.getItem('chronoBankAccount')).then(r => {
        if (!r) {
            dispatch(notify(new NoticeModel({message: 'LOC not removed'})))
            return false
        }
        dispatch(notify(new NoticeModel({message: 'LOC removed successfully'})))
        return true;
    });
};

const handleNewLOC = (address) => (dispatch) => {
    const loc = new LocDAO(address);
    loc.loadLOC().then(locModel => {
        dispatch(createLOCAction(locModel));
        dispatch(notify(new LOCNoticeModel({locModel})))
    });
};

// const handleRemoveLoc = (address) => (dispatch) => {
//     dispatch(removeLOCAction{address}));
// };
//
// const handleSetLocStatus = (address, status) => (dispatch) => {
//     dispatch(updateLOCAction({valueName: 'status', value: status, address}));
// };

const getLOCs = (account) => (dispatch) => {
    dispatch(locsLoadStartAction());
    AppDAO.getLOCs(account).then( locs => {
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
    getLOCs
}