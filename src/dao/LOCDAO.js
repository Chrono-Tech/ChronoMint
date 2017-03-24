import AbstractContractDAO from './AbstractContractDAO';
import LOCModel from '../models/LOCModel';
import { Map } from 'immutable';

// export const Setting = {locName: 0, website: 1, controller: 2, issueLimit: 3, issued: 4, redeemed: 5, publishedHash1: 6, expDate: 7, publishedHash2: 17};
export const Setting = new Map([['locName', 0], ['website', 1], ['controller', 2], ['issueLimit', 3], ['issued', 4],
    ['redeemed', 5], ['publishedHash1', 6], ['expDate', 7], ['publishedHash2', 17]]);
export const SettingString = ['locName', 'website'];
export const SettingNumber = ['controller', 'issueLimit', 'issued', 'redeemed', 'expDate'];

class LOCDAO extends AbstractContractDAO {

    constructor(at) {
        super(require('../contracts/LOC.json'), at, false);
        this.address = at;
    }

    // isController = (account) => {
    //     this.contract.then(deployed => deployed.isController.call(account, {from: account}));
    // };
    //
    getString(setting, account) {
        return this.contract.getString.call(Setting.get(setting), {from: account}).then(value => this._bytesToString(value));
    };

    getValue (setting, account) {
        return this.contract.getValue.call(Setting.get(setting), {from: account}).then(value => value.toNumber());
    };

    getStatus(account) {
        return this.contract.status.call({from: account}).then(status => status.toNumber());
    };

    loadLOC(account) {
        let locModel = new LOCModel({address: this.address});

        const callback = (valueName, value) => {
            locModel = locModel.set(valueName, value);
        };

        let promises = [];

        SettingString.forEach(setting => {
            promises.push(this.getString(setting, account).then(callback.bind(null, setting)));
        });

        SettingNumber.forEach(setting => {
            promises.push(this.getValue(setting, account).then(value => callback(setting, value)));
        });

        promises.push(Promise.all([
            this.getString('publishedHash1', account),
            this.getString('publishedHash2', account)
        ]).then((hashes) => {
            locModel = locModel.set('publishedHash', hashes[0] + hashes[1]);
        }));

        promises.push(this.getStatus(account).then(status => callback('status', status)));

        return Promise.all(promises).then(() => locModel);
    }
}

export default LOCDAO;