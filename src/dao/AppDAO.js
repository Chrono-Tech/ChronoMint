import {Map} from 'immutable';
import DAO from './DAO';
import CBEModel from '../models/CBEModel';

class AppDAO extends DAO {
    constructor() {
        super();

        this.timeEnumIndex = 8;
        this.lhtEnumIndex = 16;
    }

    getLOCCount = (account: string) => {
        return this.chronoMint.then(deployed => deployed.getLOCCount.call({from: account}));
    };

    getLOCbyID = (index: number, account: string) => {
        return this.chronoMint.then(deployed => deployed.getLOCbyID.call({index, from: account}));
    };

    reissueAsset = (asset: string, amount: number, account: string) => {
        return this.chronoMint.then(deployed => deployed.reissueAsset(asset, amount, {from: account}));
    };

    getBalance = (enumIndex: number) => {
        return this.chronoMint.then(deployed => deployed.getBalance.call(enumIndex));
    };

    getLhtBalance = () => {
        return this.getBalance(this.lhtEnumIndex);
    };

    getTimeBalance = () => {
        return this.getBalance(this.timeEnumIndex);
    };

    send = (enumIndex: number, to: string, amount: number, account: string) => {
        return this.chronoMint.then(deployed => {
            // deployed.sendAsset(enumIndex, to, amount, {from: account, gas: 3000000});
        });
    };

    sendLht = (to, amount, account) => {
        return this.send(this.lhtEnumIndex, to, amount, account);
    };

    sendTime = (to, amount, account) => {
        return this.send(this.timeEnumIndex, to, amount, account);
    };

    setExchangePrices = (buyPrice, sellPrice, account) => {
        return this.chronoMint.then(deployed => deployed.setExchangePrices(buyPrice, sellPrice, {
            from: account,
            gas: 3000000
        }));
    };

    getLOCs = (account: string) => {
        return this.chronoMint.then(deployed => deployed.getLOCs.call({from: account}));
    };

    pendingsCount = (account: string) => {
        return this.chronoMint.then(deployed => deployed.pendingsCount.call({from: account}));
    };

    pendingById = (index: number, account: string) => {
        return this.chronoMint.then(deployed => deployed.pendingById.call(index, {from: account}));
    };

    getTxsType = (conf_sign: string, account: string) => {
        return this.chronoMint.then(deployed => deployed.getTxsType.call(conf_sign, {from: account}));
    };

    pendingYetNeeded = (conf_sign: string, account: string) => {
        return this.chronoMint.then(deployed => deployed.pendingYetNeeded.call(conf_sign, {from: account}));
    };

    hasConfirmed = (conf_sign: string, checkingAccount: string, fromAccount: string) => {
        return this.chronoMint.then(deployed => deployed.hasConfirmed.call(conf_sign, checkingAccount, {from: fromAccount}));
    };

    required = (account: string) => {
        return this.chronoMint.then(deployed => deployed.required.call({from: account}));
    };

    revoke = (conf_sign: string, account: string) => {
        return this.chronoMint.then(deployed => deployed.revoke(conf_sign, {from: account}));
    };

    confirm = (conf_sign: string, account: string) => {
        return this.chronoMint.then(deployed => deployed.confirm(conf_sign, {from: account, gas: 3000000}));
    };

    setLOCString = (address: string, index: number, value: string, account: string) => {
        return this.chronoMint.then(deployed => deployed.setLOCString(address, index, value, {from: account}));
    };

    setLOCValue = (address: string, index: number, value: number, account: string) => {
        return this.chronoMint.then(deployed => deployed.setLOCValue(address, index, value, {from: account}));
    };

    proposeLOC = (locName: string, website: string, issueLimit: number, publishedHash: string, expDate: number, account: string) => {
        return this.chronoMint.then(deployed => deployed.proposeLOC(locName, website, issueLimit, publishedHash, expDate, {from: account, gas: 3000000}));
    };

    removeLOC = (address: string, account: string) => {
        return this.chronoMint.then(deployed => deployed.removeLOC(address, {from: account, gas: 3000000}));
    };

    newLOCWatch = callback => this.chronoMint.then(deployed => deployed.newLOC().watch(callback));

    confirmationWatch = (callback, filter = null) => this.chronoMint.then(deployed => deployed.Confirmation({}, filter, callback));

    revokeWatch = (callback, filter = null) => this.chronoMint.then(deployed => deployed.Revoke({}, filter, callback));

    confirmationGet = (callback, filter = null) => this.chronoMint.then(deployed => deployed.Confirmation({}, filter).get(callback));

    revokeGet = (callback, filter = null) => this.chronoMint.then(deployed => deployed.Revoke({}, filter).get(callback));

    /**
     * @param account from
     * @return Promise bool
     */
    isCBE = (account: string) => {
        return this.chronoMint.then(deployed => deployed.isAuthorized.call(account, {from: account}));
    };

    /**
     * @param account from
     * @return Promise immutable map of CBEModel associated with CBE addresses
     */
    getCBEs = (account: string) => {
        return this.chronoMint.then(deployed => {
            return deployed.getKeys.call({from: account}).then(keys => {
                return deployed.memberNames.call({from: account}).then(names => {
                    let CBEs = new Map();
                    for (let i in keys) {
                        if (keys.hasOwnProperty(i) && keys[i] > 0) {
                            let address = '0x' + keys[i].toString(16);
                            CBEs = CBEs.set(address, new CBEModel({
                                address,
                                name: names.hasOwnProperty(i) ? names[i] : null
                            }));
                        }
                    }
                    return CBEs;
                });
            })
        });
    };

    /**
     * @param cbe
     * @param account from
     * @return Promise bool result
     */
    treatCBE = (cbe: CBEModel, account: string) => {
        return this.chronoMint.then(deployed => {
            return deployed.addKey(cbe.address(), {from: account, gas: 3000000}).then(() => {
                return this.isCBE(cbe.address()).then(ok => {
                    return ok ? deployed.setMemberName(cbe.name(), {from: cbe.address(), gas: 3000000}) : false;
                });
            });
        });
    };

    /**
     * @param address of CBE
     * @param account from
     * @return Promise bool result
     */
    revokeCBE = (address: string, account: string) => {
        return this.chronoMint.then(deployed => {
            return deployed.revokeKey(address, {from: account, gas: 3000000}).then(() => {
                return !this.isCBE(address);
            });
        });
    };

    /** @param callback will receive CBEModel of updated element */
    watchUpdateCBE = (callback) => {
        this.chronoMint.then(deployed => {
            deployed.updateCBE().watch((address, name) => {
                callback(new CBEModel({address, name}));
            });
        });
    };

    /** @param callback will receive revoked address */
    watchRevokeCBE = (callback) => {
        this.chronoMint.then(deployed => {
            deployed.updateCBE().watch(callback);
        });
    };
}

export default new AppDAO();