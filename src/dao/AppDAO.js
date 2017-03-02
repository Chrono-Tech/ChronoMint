/*eslint new-cap: ["error", { "capIsNewExceptions": ["Confirmation", "Revoke"] }]*/
import {Map} from 'immutable';
import AbstractContractDAO from './AbstractContractDAO';
import AssetDAO from './AssetDAO';
import ProxyDAO from './ProxyDAO';
import CBEModel from '../models/CBEModel';
import ContractModel from '../models/ContractModel';
import TokenContractModel from '../models/TokenContractModel';

class AppDAO extends AbstractContractDAO {
    constructor() {
        super(require('../contracts/ChronoMint.json'));
        this.timeEnumIndex = 1;
        this.lhtEnumIndex = 2;
        this.proxyDAOs = [];
        this.assetDAOs = [];
    }

    getLOCCount = (account: string) => {
        return this.contract.then(deployed => deployed.getLOCCount.call({from: account}));
    };

    getLOCbyID = (index: number, account: string) => {
        return this.contract.then(deployed => deployed.getLOCbyID.call({index, from: account}));
    };

    reissueAsset = (asset: string, amount: number, account: string) => {
        return this.contract.then(deployed => deployed.reissueAsset(asset, amount, {from: account}));
    };

    getBalance = (enumIndex: number) => {
        return this.contract.then(deployed => deployed.getBalance.call(enumIndex));
    };

    // getAssetProxyIndex = (address: string) => {
    //     return this.contract.then(deployed => {
    //
    //         //deployed.contractsId(address).then(result => console.log(result));
    //     });
    // };

    getLhtBalance = () => {
        return this.getBalance(this.lhtEnumIndex);
    };

    getTimeBalance = () => {
        return this.getBalance(this.timeEnumIndex);
    };

    send = (enumIndex: number, to: string, amount: number, account: string) => {
        return this.contract.then(deployed => {
            deployed.sendAsset(enumIndex, to, amount, {from: account, gas: 3000000});
        });
    };

    sendLht = (to, amount, account) => {
        //this.getAssetProxyIndex();
        return this.send(this.lhtEnumIndex, to, amount, account);
    };

    sendTime = (to, amount, account) => {
        return this.send(this.timeEnumIndex, to, amount, account);
    };

    setExchangePrices = (buyPrice, sellPrice, account) => {
        return this.contract.then(deployed => deployed.setExchangePrices(buyPrice, sellPrice, {
            from: account,
            gas: 3000000
        }));
    };

    getLOCs = (account: string) => {
        return this.contract.then(deployed => deployed.getLOCs.call({from: account}));
    };

    pendingsCount = (account: string) => {
        return this.contract.then(deployed => deployed.pendingsCount.call({from: account}));
    };

    pendingById = (index: number, account: string) => {
        return this.contract.then(deployed => deployed.pendingById.call(index, {from: account}));
    };

    getTxsType = (conf_sign: string, account: string) => {
        return this.contract.then(deployed => deployed.getTxsType.call(conf_sign, {from: account}));
    };

    getTxsData = (conf_sign: string, account: string) => {
        return this.contract.then(deployed => deployed.getTxsData.call(conf_sign, {from: account}));
    };

    pendingYetNeeded = (conf_sign: string, account: string) => {
        return this.contract.then(deployed => deployed.pendingYetNeeded.call(conf_sign, {from: account}));
    };

    hasConfirmed = (conf_sign: string, checkingAccount: string, fromAccount: string) => {
        return this.contract.then(deployed => deployed.hasConfirmed.call(conf_sign, checkingAccount, {from: fromAccount}));
    };

    required = (account: string) => {
        return this.contract.then(deployed => deployed.required.call({from: account}));
    };

    revoke = (conf_sign: string, account: string) => {
        return this.contract.then(deployed => deployed.revoke(conf_sign, {from: account}));
    };

    confirm = (conf_sign: string, account: string) => {
        return this.contract.then(deployed => deployed.confirm(conf_sign, {from: account, gas: 3000000}));
    };

    setLOCString = (address: string, index: number, value: string, account: string) => {
        return this.contract.then(deployed => deployed.setLOCString(address, index, value, {from: account}));
    };

    setLOCValue = (address: string, index: number, value: number, account: string) => {
        return this.contract.then(deployed => deployed.setLOCValue(address, index, value, {from: account, gas: 3000000}));
    };

    proposeLOC = (locName: string, website: string, issueLimit: number, publishedHash: string, expDate: number, account: string) => {
        return this.contract.then(deployed => deployed.proposeLOC(locName, website, issueLimit, publishedHash, expDate, {
            from: account,
            gas: 3000000
        }));
    };

    removeLOC = (address: string, account: string) => {
        return this.contract.then(deployed => deployed.removeLOC(address, {from: account, gas: 3000000}));
    };

    newLOCWatch = callback => this.contract.then(deployed => deployed.newLOC().watch(callback));

    confirmationWatch = (callback, filter = null) => this.contract.then(deployed => deployed.Confirmation({}, filter, callback));

    revokeWatch = (callback, filter = null) => this.contract.then(deployed => deployed.Revoke({}, filter, callback));

    confirmationGet = (callback, filter = null) => this.contract.then(deployed => deployed.Confirmation({}, filter).get(callback));

    revokeGet = (callback, filter = null) => this.contract.then(deployed => deployed.Revoke({}, filter).get(callback));

    /**
     * @param account from
     * @return Promise bool
     */
    isCBE = (account: string) => {
        return this.contract.then(deployed => deployed.isAuthorized.call(account, {from: account}));
    };

    /** @return Promise CBEModel map */
    getCBEs = () => {
        return this.contract.then(deployed => {
            return deployed.getMembers.call().then(result => {
                let addresses = result[0];
                let names = result[1];
                let map = new Map();
                for (let key in addresses) {
                    if (addresses.hasOwnProperty(key) && names.hasOwnProperty(key)) {
                        map = map.set(addresses[key], new CBEModel({
                            address: addresses[key],
                            name: this.bytes32ToString(names[key])
                        }))
                    }
                }
                return map;
            });
        });
    };

    /**
     * @param cbe
     * @param account from
     * @return Promise bool result
     */
    treatCBE = (cbe: CBEModel, account: string) => {
        return this.contract.then(deployed => {
            return deployed.addKey(cbe.address(), {from: account, gas: 3000000}).then(() => {
                return this.isCBE(cbe.address()).then(ok => {
                    return ok ? deployed.setMemberName(cbe.address(), cbe.name(), {
                            from: account,
                            gas: 3000000
                        }) : false;
                });
            });
        });
    };

    /**
     * @param cbe
     * @param account from
     * @return Promise bool result
     */
    revokeCBE = (cbe: CBEModel, account: string) => {
        if (cbe.address() === account) { // prevent self deleting
            return new Promise(resolve => resolve(false));
        }
        return this.contract.then(deployed => {
            return deployed.revokeKey(cbe.address(), {from: account, gas: 3000000}).then(() => {
                return this.isCBE(cbe.address());
            });
        });
    };

    /**
     * @param callbackUpdate will receive CBEModel of updated element
     * @param callbackRevoke will receive CBEModel of revoked element
     * @param account from
     */
    watchUpdateCBE = (callbackUpdate, callbackRevoke, account: string) => {
        this.contract.then(deployed => {
            deployed.userUpdate().watch((error, result) => {
                if (error) {
                    return;
                }
                let address = result.args.key;
                this.isCBE(address).then(r => {
                    if (r) { // update
                        deployed.getMemberName.call(address, {from: account}).then(name => {
                            callbackUpdate(new CBEModel({address, name}));
                        });
                    } else { // revoke
                        callbackRevoke(new CBEModel({address}));
                    }
                });
            });
        });
    };

    /** @param callback will receive ContractModel one-by-one AND total number of contracts */
    getOtherContracts = (callback) => {
        this.contract.then(deployed => {
            deployed.getOtherContracts.call().then(contracts => {
                // TODO We need this first cycle because of redundant empty addresses that backend may return
                let contractsFinal = [];
                for (let i in contracts) {
                    if (contracts.hasOwnProperty(i) && !this.isEmptyAddress(contracts[i])) {
                        contractsFinal.push(contracts[i]);
                    }
                }

                for (let j in contractsFinal) {
                    if (contractsFinal.hasOwnProperty(j)) {
                        let contract = new ContractModel({address: contractsFinal[j], name: 'Unknown'});
                        callback(contract, contractsFinal.length);
                    }
                }
            });
        });
    };

    /** @param callback will receive TokenContractModel one-by-one AND total number of contracts */
    getTokenContracts = (callback) => {
        this.contract.then(deployed => {
            deployed.getContracts.call().then(contracts => {
                // TODO We need this first cycle because of redundant empty addresses that backend may return
                let contractsFinal = [];
                for (let i in contracts) {
                    if (contracts.hasOwnProperty(i) && !this.isEmptyAddress(contracts[i])) {
                        contractsFinal.push(contracts[i]);
                    }
                }

                for (let j in contractsFinal) {
                    if (contractsFinal.hasOwnProperty(j)) {
                        let contract = new TokenContractModel({proxy: contractsFinal[j]});
                        contract.proxy().then(proxy => {
                            proxy.getLatestVersion().then(address => {
                                contract = contract.set('address', address);
                                proxy.getName().then(name => {
                                    contract = contract.set('name', name);
                                    proxy.getSymbol().then(symbol => {
                                        contract = contract.set('symbol', symbol);
                                        callback(contract, contractsFinal.length);
                                    });
                                });
                            });
                        });
                    }
                }
            });
        });
    };

    getTokenBalances = (symbol, offset, length) => {
        offset++;
        return this.contract.then(deployed => {
            return deployed.getAssetBalances.call(symbol, offset, length).then(result => {
                let addresses = result[0];
                let balances = result[1];
                let map = new Map();
                for (let key in addresses) {
                    if (addresses.hasOwnProperty(key) && balances.hasOwnProperty(key)
                        && !this.isEmptyAddress(addresses[key])) {
                        map = map.set(addresses[key], balances[key].toNumber());
                    }
                }
                return map;
            });
        });
    };

    /**
     * @param current will be removed from list
     * @param newAddress proxy or asset
     * @param account from
     * @return Promise bool result
     */
    treatToken = (current: TokenContractModel, newAddress: string, account: string) => {
        if (current.address() === newAddress || current.proxyAddress() === newAddress) {
            return new Promise(resolve => resolve(true));
        }

        let callback = (proxyAddress) => {
            return this.initProxyDAO(proxyAddress).then(() => {
                return this.contract.then(deployed => {
                    return deployed.setAddress(proxyAddress, {from: account, gas: 3000000}).then(() => {
                        // if current is null then we don't need to remove it
                        return !current.address() ? true :
                            deployed.removeAddress(current.address(), {from: account, gas: 3000000}).then(() => true);
                    });
                });
            }, error => false);
        };

        // we need to know whether the newAddress is proxy or asset
        return this.initAssetDAO(newAddress).then(asset => {
            return asset.getProxyAddress().then(proxyAddress => callback(proxyAddress));
        }, error => callback(newAddress));
    };

    /**
     * Initialize contract asset AbstractContractDAO or return already initialized if exists
     * @param address
     * @return AssetDAO|bool AbstractContractDAO or false for invalid contract address case
     */
    initAssetDAO = (address: string) => {
        return new Promise((resolve, reject) => {
            if (this.assetDAOs.hasOwnProperty(address)) {
                resolve(this.assetDAOs[address]);
            }
            this.assetDAOs[address] = new AssetDAO(address);
            this.assetDAOs[address].contract.then(() => {
                resolve(this.assetDAOs[address]);
            }).catch(e => {
                reject(e);
            });
        });
    };

    /**
     * Initialize contract proxy AbstractContractDAO or return already initialized if exists
     * @param address
     * @return ProxyDAO|bool AbstractContractDAO or false for invalid contract address case
     */
    initProxyDAO = (address: string) => {
        return new Promise((resolve, reject) => {
            if (this.proxyDAOs.hasOwnProperty(address)) {
                resolve(this.proxyDAOs[address]);
            }
            this.proxyDAOs[address] = new ProxyDAO(address);
            this.proxyDAOs[address].contract.then(() => {
                resolve(this.proxyDAOs[address]);
            }).catch(e => {
                reject(e);
            });
        });
    };

    /**
     * @param callback will receive TokenContractModel
     */
    watchUpdateToken = (callback) => {
        this.contract.then(deployed => {
            deployed.updateContract().watch((error, result) => {
                if (error) {
                    return;
                }
                this.initProxyDAO(result.args.contractAddress).then(proxy => {
                    proxy.getLatestVersion().then(address => {
                        proxy.getSymbol().then(symbol => {
                            callback(new TokenContractModel({
                                address: address,
                                proxy: result.args.contractAddress,
                                symbol
                            }), false);
                        });
                    });
                });
            });
        });
    };
}

export default new AppDAO();