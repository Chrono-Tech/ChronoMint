import AppDAO from '../../../dao/AppDAO';
import LocDAO from '../../../dao/LocDAO';
import {notify} from '../../../redux/ducks/notifier/notifier';
import LOCNoticeModel from '../../../models/notices/LOCNoticeModel';
import {LOCS_LOAD_START, LOCS_LOAD_SUCCESS} from './communication';
import { createAllLOCsAction, createLocAction, updateLocAction, removeLocAction } from './reducer';

const locsLoadStartAction = () => ({type: LOCS_LOAD_START});
const locsLoadSuccessAction = (payload) => ({type: LOCS_LOAD_SUCCESS, payload});

const updateLOC = (data) => (dispatch) => {
    AppDAO.updateLOC(data, data.account);
};

const issueLH = (data) => {
    const {account, issueAmount, locAddress} = data;
    return AppDAO.reissueAsset('LHT', issueAmount, account, locAddress);
};

const proposeLOC = (props) => {
    let {locName, website, issueLimit, publishedHash, expDate, account} = props;
    AppDAO.proposeLOC(locName, website, issueLimit, publishedHash, expDate, account);
};

const removeLOC = (address) => {
    AppDAO.removeLOC(address, localStorage.getItem('chronoBankAccount'));
};

const handleNewLOC = (address) => (dispatch) => {
    const loc = new LocDAO(address);
    loc.loadLOC().then(locModel => {
        dispatch(createLocAction(locModel));
        dispatch(notify(new LOCNoticeModel({locModel})))
    });
};

// const handleRemoveLoc = (address) => (dispatch) => {
//     dispatch(removeLocAction({address}));
// };
//
// const handleSetLocStatus = (address, status) => (dispatch) => {
//     dispatch(updateLocAction({valueName: 'status', value: status, address}));
// };

const getLOCs = (account) => (dispatch) => {
    dispatch(locsLoadStartAction());
    AppDAO.getLOCs(account).then( locs => {
        dispatch(createAllLOCsAction(locs));
        dispatch(locsLoadSuccessAction());
    });
};

const getLOCsOnce = () => (dispatch, getState) => {
    if (!getState().get('locsCommunication').isNeedReload) return;
    dispatch(getLOCs(localStorage.chronoBankAccount));
};

export {
    proposeLOC,
    updateLOC,
    issueLH,
    removeLOC,
    handleNewLOC,
    getLOCsOnce
}