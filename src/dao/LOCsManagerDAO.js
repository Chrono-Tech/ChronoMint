import {Map} from 'immutable';
import AbstractContractDAO from './AbstractContractDAO';
import LocDAO, {Setting, SettingString, SettingNumber} from './LOCDAO';

class LOCsManagerDAO extends AbstractContractDAO {

    getLOCCount = (account: string) => {
        return this.contract.then(deployed => deployed.getLOCCount.call({from: account}));
    };

    getLOCs = (account: string) => {
        return this.contract.then(deployed => deployed.getLOCs.call({from: account}).then(r => {
            const promises = [];
            let locs = new Map([]);
            r.forEach(address => {
                const loc = new LocDAO(address);
                let promise = loc.loadLOC();
                promise.then(locModel => {
                    locs = locs.set(address, locModel)
                });
                promises.push(promise);
            });
            return Promise.all(promises).then(() => locs );
        }));
    };

    updateLOC(data: array, account: string) {
        const loc = new LocDAO(data.address);
        this.contract.then(deployed => {

            SettingString.forEach(settingName => {
                if (data[settingName] === undefined) return;
                let value = data[settingName];
                let settingIndex = Setting.get(settingName);
                loc.getString(settingName, account).then(r => {
                    if (r === value) return;
                    deployed.setLOCString(data.address, settingIndex, this._toBytes32(value), {from: account});
                });
            });

            SettingNumber.forEach(settingName => {
                if (data[settingName] === undefined) return;
                let value = +data[settingName];
                let settingIndex = Setting.get(settingName);
                loc.getValue(settingName, account).then(r => {
                    if (r.toNumber() === value) return;
                    deployed.setLOCValue(data.address, settingIndex, value, {from: account, gas: 3000000});
                });
            });

            if (data.status) {
                loc.getStatus(account).then(r => {
                    if (r.toNumber() === data.status) return;
                    deployed.setLOCStatus(data.address, data.status, {from: account, gas: 3000000});
                });
            }

            let value = data.publishedHash;
            if (value) {
                const [publishedHash1, publishedHash2] = value.match(/.{1,32}/g);
                loc.getString('publishedHash1', account).then(r => {
                    if (r === publishedHash1) return;
                    deployed.setLOCString(data.address, Setting.get('publishedHash1'), this._toBytes32(publishedHash1), {from: account});
                    deployed.setLOCString(data.address, Setting.get('publishedHash2'), this._toBytes32(publishedHash2), {from: account});
                });
            }

        });
        return Promise.resolve(true);
    }

    proposeLOC = (locName: string, website: string, issueLimit: number, publishedHash: string,
                  expDate: number, account: string) => {
        const [publishedHash1, publishedHash2] = publishedHash.match(/.{1,32}/g);

        return this.contract.then(deployed => deployed.proposeLOC(
            this._toBytes32(locName), this._toBytes32(website), issueLimit,
            this._toBytes32(publishedHash1), this._toBytes32(publishedHash2),
            expDate, {
                from: account,
                gas: 3000000
            }
        ));
    };

    removeLOC = (address: string, account: string) => {
        return this.contract.then(deployed => deployed.removeLOC(address, {from: account, gas: 3000000}));
    };

    newLOCWatch = callback => this.contract.then(deployed => {
        const blockNumber = this.web3.eth.blockNumber;
        deployed.newLOC({}, {}, (e, r) => {
            if (r.blockNumber <= blockNumber) return;
            const loc = new LocDAO(r.args._LOC);
            loc.loadLOC().then(callback);
        });
    });

    remLOCWatch = callback => this.contract.then(deployed => {
        const blockNumber = this.web3.eth.blockNumber;
        deployed.remLOC({}, {}, (e, r) => {
            if (r.blockNumber <= blockNumber) return;
            callback(r.args._LOC);
        });
    });

    updLOCStatusWatch = callback => this.contract.then(deployed => {
        const blockNumber = this.web3.eth.blockNumber;
        deployed.updLOCStatus({}, {}, (e, r) => {
            let status = 0; //  todo rework r.args._status
            if (r.blockNumber > blockNumber) callback(r.args._LOC, status);
        });
    });

    updLOCValueWatch = callback => this.contract.then(deployed => {
        const blockNumber = this.web3.eth.blockNumber;
        deployed.updLOCValue ({}, {}, (e, r) => {
            if (r.blockNumber <= blockNumber) return;
            const value = 'zzzzz'; //  todo r.args.value
            const setting = 0; //  todo r.args.setting
            const settingName = Setting.findKey( key => key === setting);
            callback(r.args._LOC, settingName, value);
        });
    });

    // getLOCbyID = (index: number, account: string) => {
    //     return this.contract.then(deployed => deployed.getLOCbyID.call(index, {from: account}));
    // };
    //
    // setLOCString = (address: string, index: number, value: string, account: string) => {
    //     return this.contract.then(deployed => deployed.setLOCString(address, index, this._toBytes32(value), {from: account}));
    // };
    //
    // setLOCValue = (address: string, index: number, value: number, account: string) => {
    //     return this.contract.then(deployed => deployed.setLOCValue(address, index, value, {
    //         from: account,
    //         gas: 3000000
    //     }));
    // };
    //
    // setLOCStatus = (address: string, status: number, account: string) => {
    //     return this.contract.then(deployed => deployed.status.call().then(function(r){
    //         if (r === status) return false;
    //         deployed.setLOCStatus(address, status, {
    //             from: account, gas: 3000000});
    //         return true;
    //     }));
    // };

}

export default new LOCsManagerDAO(require('../contracts/ChronoMint.json'));