import {updateLOCinStore, createLOCinStore} from './locs';
import AppDAO from '../../../dao/AppDAO';
import LocDAO from '../../../dao/LocDAO';
import {notify} from '../../../redux/ducks/notifier/notifier';
import LOCNoticeModel from '../../../models/notices/LOCNoticeModel';
import {used} from '../../../components/common/flags';

const Setting = {locName: 0, website: 1, controller: 2, issueLimit: 3, issued: 4, redeemed: 5, publishedHash: 6, expDate: 7};
const SettingString = ['locName', 'website', 'publishedHash'];

const loadLOC = (address) => (dispatch, getState) => {
    const loc = new LocDAO(address).contract;
    const account = localStorage.getItem('chronoBankAccount');

    const callback = (valueName, value) => {
        dispatch(updateLOCinStore(valueName, value, address));
    };

    dispatch(createLOCinStore(address));

    let promises = [];
    for (let setting in Setting) {
        if (Setting.hasOwnProperty(setting)) {
            let operation;
            if ( SettingString.includes(setting) ) {
                operation = loc.getString;
            } else {
                operation = loc.getValue;
            }
            let promise = operation(Setting[setting], {from: account});
            promise.then(callback.bind(null, setting));
            promises.push(promise);
        }
    }

    return Promise.all(promises).then(() => getState().get('locs').get(address));
};

const updateLOC = (data) => (dispatch) => {
    const {address, account} = data;

    const callback = (valueName, value)=>{
        dispatch(updateLOCinStore(valueName, value, address));
    };

    for (let settingName in Setting) {
        if (data[settingName] === undefined) continue;
        let value = data[settingName];
        let settingIndex = Setting[settingName];
        if ( SettingString.includes(settingName)) {
            //  TODO Add setLOCString event
            AppDAO.setLOCString(address, settingIndex, value, account).then(
                () => callback(settingName, value)
            );
        } else {
            AppDAO.setLOCValue(address, settingIndex, value, account);
        }
    }
};

const issueLH = (data) => {
    const {account, issueAmount} = data;
    AppDAO.reissueAsset('LHT', issueAmount, account);
};

const proposeLOC = (props) => {
    let {locName, website, issueLimit, publishedHash, expDate, account} = props;
    AppDAO.proposeLOC(locName, website, issueLimit, publishedHash, expDate, account)
        .catch(error => console.error(error));
};

const removeLOC = (address) => {
    AppDAO.removeLOC(address, localStorage.getItem('chronoBankAccount'));
};

const handleNewLOC = (address) => (dispatch) => {
    dispatch(loadLOC(address)).then(loc => {
        dispatch(notify(new LOCNoticeModel({loc})))
    });
};

const getLOCs = (account) => (dispatch) => {
    //dispatch(pendingsLoading());
    // const promises = [];
    AppDAO.getLOCs(account)
        .then(r => r.forEach(address => dispatch(loadLOC(address)))
        // Promise.all(promises).then(() => dispatch(pendingsLoaded()));
    );
};

const getLOCsOnce = () => (dispatch) => {
    if (used(getLOCs)) return;
    dispatch(getLOCs(localStorage.chronoBankAccount));
};

export {
    proposeLOC,
    updateLOC,
    issueLH,
    removeLOC,
    loadLOC,
    handleNewLOC,
    getLOCsOnce
}