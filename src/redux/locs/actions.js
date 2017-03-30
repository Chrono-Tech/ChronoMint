import TokenContractsDAO from '../../dao/TokenContractsDAO';
import LOCsManagerDAO from '../../dao/LOCsManagerDAO';
import {LOCS_FETCH_START, LOCS_FETCH_END} from './communication';
import { LOCS_LIST, LOC_CREATE, LOC_UPDATE, LOC_REMOVE } from './reducer';
import { showAlertModal } from '../ui/modal';

const listLOCs = (data) => ({type: LOCS_LIST, data});
const createLOC = (data) => ({type: LOC_CREATE, data});
const updateLOCAction = (data) => ({type: LOC_UPDATE, data});
const removeLOCAction = (data) => ({type: LOC_REMOVE, data});

const updateLOC = (data, hideModal) => (dispatch) => {
    return LOCsManagerDAO.updateLOC(data, data.account).then( (r) => {
        if (r === true){
            hideModal();
        } else {
            dispatch(showAlertModal({title: 'Error', message: 'LOC not updated'}));
        }
    });
};

const issueLH = (data, hideModal) => (dispatch) => {
    const {account, issueAmount, address, issued} = data;
    return TokenContractsDAO.reissueAsset('LHT', issueAmount, account, address).then(r => {
        if (!r) {
            dispatch(showAlertModal({title: 'Error', message: 'LH not issued'}));
        }
        LOCsManagerDAO.updateLOC({issued, account, address}, account);
        hideModal();
    });
};

const proposeLOC = (props, hideModal) => (dispatch) => {
    let {locName, website, issueLimit, publishedHash, expDate, account} = props;
    return LOCsManagerDAO.proposeLOC(locName, website, issueLimit, publishedHash, expDate, account).then(r => {
        if (!r) {
            dispatch(showAlertModal({title: 'Error', message: loc.name() + ' Not proposed'}));
        } else {
            hideModal();
        }
        return r;
    });
};

const submitLOC = (data, hideModal) => (dispatch) => {
    if (!data.address) {
        return dispatch(proposeLOC(data, hideModal));
    } else {
        return dispatch(updateLOC(data, hideModal));
    }
};

const removeLOC = (address, account, hideModal) => (dispatch) => {
    return LOCsManagerDAO.removeLOC(address, account).then(r => {
        if (!r) {
            dispatch(showAlertModal({title: 'Error', message: 'LOC not removed.'}));
        }
        hideModal();
    });
};

const handleNewLOC = (locModel) => (dispatch) => {
    dispatch({type: LOC_CREATE, data: locModel});
};

const handleRemoveLOC = (address) => (dispatch) => {
    dispatch({type: LOC_REMOVE, data: {address}});
};

const handleUpdateLOCValue = (address, valueName, value) => (dispatch) => {
    dispatch({type: LOC_UPDATE, data: {valueName, value, address}});
};

const getLOCs = (account) => (dispatch) => {
    dispatch({type: LOCS_FETCH_START});
    return LOCsManagerDAO.getLOCs(account).then( locs => {
        dispatch({type: LOCS_LIST, data: locs});
        dispatch({type: LOCS_FETCH_END});
    });
};

export {
    submitLOC,
    issueLH,
    removeLOC,
    handleNewLOC,
    handleRemoveLOC,
    handleUpdateLOCValue,
    getLOCs,
    listLOCs,
    createLOC,
    updateLOCAction,
    removeLOCAction

}