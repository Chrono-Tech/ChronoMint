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
            deployed.sendAsset(enumIndex, to, amount, {from: account, gas: 3000000});
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

    /**
     * @param account from
     * @return Promise bool
     */
    isCBE = (account: string) => {
        return this.chronoMint.then(deployed => deployed.isAuthorized.call(account, {from: account}));
    };

    /**
     * @param callback will receive number of authorized keys and CBEModel one-by-one
     * @param account from
     * @return Promise number of CBEs that should be sent to the callback
     */
    getCBEs = (callback, account: string) => {
        this.chronoMint.then(deployed => {
            deployed.numAuthorizedKeys.call({from: account}).then(num => {
                num = num.toNumber() - 1;
                for (let i = 0; i < num; i++) {
                    deployed.getOwner.call(i, {from: account}).then(address => {
                        deployed.getMemberName.call(address, {from: account}).then(name => {
                            callback(num, new CBEModel({address, name}));
                        });
                    });
                }
            });
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
                    return ok ? deployed.setMemberName(cbe.address(), cbe.name(), {from: account, gas: 3000000}) : false;
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
        if (address == account) { // prevent self deleting
            return new Promise(resolve => resolve(false));
        }
        return this.chronoMint.then(deployed => {
            return deployed.revokeKey(address, {from: account, gas: 3000000}).then(() => {
                return this.isCBE(address);
            });
        });
    };

    /**
     * @param callbackUpdate will receive CBEModel of updated element
     * @param callbackRevoke will receive address of revoked CBE
     * @param account from
     */
    watchUpdateCBE = (callbackUpdate, callbackRevoke, account: string) => {
        this.chronoMint.then(deployed => {
            deployed.updateCBE().watch(address => {
                this.isCBE(address).then(r => {
                    if (r) { // update
                        deployed.getMemberName.call(address, {from: account}).then(name => {
                            callbackUpdate(new CBEModel({address, name}));
                        });
                    } else { // revoke
                        callbackRevoke(address);
                    }
                });
            });
        });
    };
}

export default new AppDAO();