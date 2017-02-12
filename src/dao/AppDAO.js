import {Map} from 'immutable';
import DAO from './dao';
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
            console.log(to, account, deployed);
            deployed.sendAsset(enumIndex, to, amount, {from: account, gas: 3000000});
        });
    };

    sendLht = (to, amount, account) => {
        console.log(to, amount, account);
        return this.send(this.lhtEnumIndex, to, amount, account);
    };

    sendTime = (to, amount, account) => {
        return this.send(this.timeEnumIndex, to, amount, account);
    };

    setExchangePrices = () => {

    };

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
                let CBEs = new Map();
                for (let i in keys) {
                    if (keys.hasOwnProperty(i) && keys[i] > 0) {
                        let address = '0x' + keys[i].toString(16);
                        CBEs = CBEs.set(address, new CBEModel({
                            address,
                            name: 'Test Name'
                        }));
                    }
                }
                return CBEs;
                // TODO Uncomment code below and delete code above when memberNames will work
                // return deployed.memberNames.call({from: account}).then(names => {
                //     let CBEs = new Map();
                //     for (let i in keys) {
                //         if (keys.hasOwnProperty(i) && keys[i] > 0) {
                //             let address = '0x' + keys[i].toString(16);
                //             CBEs = CBEs.set(address, new CBEModel({
                //                 address,
                //                 name: names.hasOwnProperty(i) ? names[i] : null
                //             }));
                //         }
                //     }
                //     return CBEs;
                // });
            })
        });
    };

    /**
     * @param cbe
     * @param account from
     * @return Promise bool result
     */
    addCBE = (cbe: CBEModel, account: string) => {
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