import AbstractContractDAO from './AbstractContractDAO';
import LOCModel from '../models/LOCModel';

const Setting = {locName: 0, website: 1, controller: 2, issueLimit: 3, issued: 4, redeemed: 5, publishedHash: 6, expDate: 7};
const SettingString = ['locName', 'website', 'publishedHash'];

class LocDAO extends AbstractContractDAO {

    constructor(at) {
        super(require('../contracts/LOC.json'), at, false);
        this.address = at;
    }

    isController = (account) => {
        this.contract.then(deployed => deployed.isController.call(account, {from: account}));
    };

    getString = (setting, account) => {
        return this.contract.getString.call(Setting[setting], {from: account});
    };

    getValue = (setting, account) => {
        return this.contract.getValue.call(Setting[setting], {from: account});
    };

    getStatus(account) {
        return this.contract.status.call({from: account});
    };

    loadLOC() {
        let locModel = new LOCModel({address: this.address});
        const account = localStorage.getItem('chronoBankAccount');

        const callback = (valueName, value) => {
            locModel = locModel.set(valueName, value);
        };

        let promises = [];
        for (let setting in Setting) {
            if (Setting.hasOwnProperty(setting)) {
                let operation;
                if ( SettingString.includes(setting) ) {
                    operation = this.getString;
                } else {
                    operation = this.getValue;
                }
                let promise = operation(setting, account);
                promise.then(callback.bind(null, setting));
                promises.push(promise);
            }
        }

        let promise = this.getStatus(account);
        promise.then(callback.bind(null, 'status'));
        promises.push(promise);

        return Promise.all(promises).then(() => locModel);
    }
}

export default LocDAO;