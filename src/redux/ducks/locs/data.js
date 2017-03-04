import AppDAO from '../../../dao/AppDAO';
import LocDAO from '../../../dao/LocDAO';
import {updateLOCinStore, createLOCinStore} from './locs';
import {notify} from '../../../redux/ducks/notifier/notifier';
import LOCNoticeModel from '../../../models/notices/LOCNoticeModel';
import {store} from '../../configureStore';

const Setting = {locName: 0, website: 1, controller: 2, issueLimit: 3, issued: 4, redeemed: 5, publishedHash: 6, expDate: 7};
const SettingString = ['locName', 'website', 'publishedHash'];

const loadLOC = (address) => {
    const loc = new LocDAO(address).contract;
    const account = localStorage.getItem('chronoBankAccount');

    const callback = (valueName, value) => {
        updateLOCinStore(valueName, value, address);
    };

    createLOCinStore(address);

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

    return Promise.all(promises).then(() => store.getState().get('locs').get(address));
};

const updateLOC = (data) => {
    const {address, account} = data;

    const callback = (valueName, value)=>{
        updateLOCinStore(valueName, value, address);
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
    loadLOC(address).then(loc => {dispatch(notify(new LOCNoticeModel({loc})))});
};

const account = localStorage.getItem('chronoBankAccount');
AppDAO.getLOCs(account)//todo     if (used(getLOCs)) return;
    .then(r => r.forEach(loadLOC));
// componentWillMount(){ todo move to page like:
//     this.props.getPendingsOnce();
// }

export {
    proposeLOC,
    updateLOC,
    issueLH,
    removeLOC,
    loadLOC,
    handleNewLOC
}