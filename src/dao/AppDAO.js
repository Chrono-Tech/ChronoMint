/*eslint new-cap: ["error", { "capIsNewExceptions": ["Confirmation", "Revoke"] }]*/
import {Map} from 'immutable';
import AbstractContractDAO from './AbstractContractDAO';
import OrbitDAO from './OrbitDAO';
import AssetDAO from './AssetDAO';
import ProxyDAO from './ProxyDAO';
import {RewardsDAO} from './RewardsDAO';
import {ExchangeDAO} from './ExchangeDAO';
import UserModel from '../models/UserModel';
import CBEModel from '../models/CBEModel';
import AbstractOtherContractModel from '../models/contracts/AbstractOtherContractModel';
import TokenContractModel from '../models/contracts/TokenContractModel';

const DAO_PROXY = 'proxy';
const DAO_ASSET = 'asset';
const DAO_REWARDS = 'rewards';
const DAO_EXCHANGE = 'exchange';

class AppDAO extends AbstractContractDAO {
    getDAOs = () => {
        let dao = {};
        dao[DAO_PROXY] = ProxyDAO;
        dao[DAO_ASSET] = AssetDAO;
        dao[DAO_REWARDS] = RewardsDAO;
        dao[DAO_EXCHANGE] = ExchangeDAO;
        return dao;
    };

    /**
     * Should return DAO types for all other contracts.
     * @see AbstractOtherContractDAO
     * @return {[number,string]}
     */
    getOtherDAOsTypes = () => {
        return [
            DAO_REWARDS,
            DAO_EXCHANGE
        ];
    };

    constructor() {
        super(require('../contracts/ChronoMint.json'));

        this.timeEnumIndex = 1;
        this.lhtEnumIndex = 2;

        // initialize contracts DAO storage with empty arrays
        this.contracts = {};
        const types = Object.keys(this.getDAOs());
        for (let key in types) {
            if (types.hasOwnProperty(key)) {
                this.contracts[types[key]] = [];
            }
        }
    }

    initDAO = (dao: string, address: string, block = 'latest') => {
        return new Promise((resolve, reject) => {
            const key = address + '-' + block;
            if (this.contracts[dao].hasOwnProperty(key)) {
                resolve(this.contracts[dao][key]);
            }
            const DAOClass = this.getDAOs()[dao];
            this.contracts[dao][key] = new DAOClass(address);
            this.contracts[dao][key].web3.eth.defaultBlock = block;
            this.contracts[dao][key].contract.then(() => {
                resolve(this.contracts[dao][key]);
            }).catch(e => {
                reject(e);
            });
        });
    };

    /**
     * Initialize AssetDAO or return already initialized if exists
     * @param address
     * @return {Promise.<AssetDAO|bool>} promise dao or false for invalid contract address case
     */
    initAssetDAO = (address: string) => {
        return this.initDAO(DAO_ASSET, address);
    };

    /**
     * Initialize ProxyDAO or return already initialized if exists
     * @param address
     * @param block number
     * @return {Promise.<ProxyDAO|bool>} promise dao or false for invalid contract address case
     */
    initProxyDAO = (address: string, block = 'latest') => {
        return this.initDAO(DAO_PROXY, address, block);
    };

    getLOCCount = (account: string) => {
        return this.contract.then(deployed => deployed.getLOCCount.call({from: account}));
    };

    getLOCbyID = (index: number, account: string) => {
        return this.contract.then(deployed => deployed.getLOCbyID.call({index, from: account}));
    };

    reissueAsset = (asset: string, amount: number, account: string) => {
        return this.contract.then(deployed => deployed.reissueAsset(asset, amount, {from: account, gas: 3000000}));
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
        return this.contract.then(deployed => deployed.setLOCValue(address, index, value, {
            from: account,
            gas: 3000000
        }));
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
     * @param account for which you want to get profile
     * @param block
     * @return {Promise.<UserModel>}
     */
    getMemberProfile = (account: string, block = 'latest') => {
        return new Promise(resolve => {
            this.contract.then(deployed => {
                deployed.getMemberHash.call(account, {}, block).then(result => {
                    OrbitDAO.get(this.bytesToString(result[0]) + this.bytesToString(result[1])).then(data => {
                        resolve(new UserModel(data));
                    });
                });
            });
        });
    };

    /**
     * @param account
     * @param profile
     * @param own true to change own profile, false to change foreign profile
     * @param from account if own is false
     * @return {Promise.<bool>}
     */
    setMemberProfile = (account: string, profile: UserModel, own: boolean = true, from: string = null) => {
        return new Promise(resolve => {
            OrbitDAO.put(profile.toJS()).then(hash => {
                const hash1 = this.toBytes32(hash.substr(0, 32));
                const hash2 = this.toBytes32(hash.substr(32), true);
                this.contract.then(deployed => {
                    const params = {from: own ? account : from, gas: 3000000};
                    if (own) {
                        deployed.setOwnHash(hash1, hash2, params).then(r => resolve(r));
                    } else {
                        deployed.setMemberHash(account, hash1, hash2, params).then(r => resolve(r));
                    }
                });
            });
        });
    };


    /**
     * CBE
     ***********************************************
     *
     * @param account from
     * @param block number
     * @return {Promise.<bool>}
     */
    isCBE = (account: string, block = 'latest') => {
        return this.contract.then(deployed => deployed.isAuthorized.call(account, {}, block));
    };

    /** @return {Promise.<Map[string,CBEModel]>} associated with CBE account address */
    getCBEs = () => {
        return new Promise(resolve => {
            this.contract.then(deployed => {
                deployed.getCBEMembers.call().then(result => {
                    let map = new Map();
                    const callback = (address, hash) => {
                        OrbitDAO.get(hash).then(data => {
                            const user = new UserModel(data);
                            map = map.set(address, new CBEModel({
                                address: address,
                                name: user.name(),
                                user
                            }));
                            if (map.size === result[0].length) {
                                resolve(map);
                            }
                        })
                    };
                    for (let key in result[0]) {
                        if (result[0].hasOwnProperty(key) && result[1].hasOwnProperty(key)
                            && result[2].hasOwnProperty(key)) {
                            callback(
                                result[0][key],
                                this.bytesToString(result[1][key]) + this.bytesToString(result[2][key])
                            );
                        }
                    }
                });
            });
        });
    };

    /**
     * @param cbe
     * @param account from
     * @return {Promise.<bool>} result
     */
    treatCBE = (cbe: CBEModel, account: string) => {
        return new Promise(resolve => {
            this.getMemberProfile(cbe.address()).then(user => {
                user = user.set('name', cbe.name());
                this.setMemberProfile(cbe.address(), user, false, account).then(() => {
                    this.contract.then(deployed => {
                        this.isCBE(cbe.address()).then(isCBE => {
                            if (!isCBE) {
                                deployed.addKey(cbe.address(), {from: account, gas: 3000000}).then(() => resolve(true));
                            } else {
                                cbe = cbe.set('name', cbe.name());
                                cbe = cbe.set('user', user);
                                resolve(cbe);
                            }
                        });
                    });
                });
            });
        });
    };

    /**
     * @param cbe
     * @param account from
     * @return {Promise.<bool>} result
     */
    revokeCBE = (cbe: CBEModel, account: string) => {
        return new Promise(resolve => {
            this.contract.then(deployed => {
                deployed.revokeKey(cbe.address(), {from: account, gas: 3000000}).then(() => {
                    this.isCBE(cbe.address()).then(result => resolve(true));
                });
            });
        });
    };

    /**
     * @param callback will receive CBEModel of updated/revoked element
     * @param account from
     */
    watchUpdateCBE = (callback, account: string) => {
        this.contract.then(deployed => {
            this.watch(deployed.cbeUpdate, (result, block, ts) => {
                const address = result.args.key;
                if (address === account) {
                    return;
                }
                this.isCBE(address, block).then(r => {
                    if (r) { // update
                        this.getMemberProfile(address, block).then(user => {
                            callback(new CBEModel({
                                address,
                                user,
                                name: user.name()
                            }), ts, false);
                        });
                    } else { // revoke
                        callback(new CBEModel({address}), ts, true);
                    }
                });
            });
        });
    };


    /**
     * TOKEN CONTRACTS
     ***********************************************
     *
     * @return {Promise.<Map[string,TokenContractModel]>} associated with token asset address
     */
    getTokenContracts = () => {
        return new Promise(resolve => {
            this.contract.then(deployed => {
                deployed.getContracts.call().then(contracts => {
                    let map = new Map();
                    const callback = (proxyAddress) => {
                        let contract = new TokenContractModel({proxy: proxyAddress});
                        contract.proxy().then(proxy => {
                            proxy.getLatestVersion().then(address => {
                                proxy.getName().then(name => {
                                    proxy.getSymbol().then(symbol => {
                                        contract = contract.set('address', address);
                                        contract = contract.set('name', name);
                                        contract = contract.set('symbol', symbol);
                                        map = map.set(contract.address(), contract);
                                        if (map.size === contracts.length) {
                                            resolve(map);
                                        }
                                    });
                                });
                            });
                        });
                    };
                    for (let j in contracts) {
                        if (contracts.hasOwnProperty(j)) {
                            callback(contracts[j]);
                        }
                    }
                });
            });
        });
    };

    getTokenBalances = (symbol, offset, length) => {
        offset++;
        return new Promise(resolve => {
            this.contract.then(deployed => {
                deployed.getAssetBalances.call(symbol, offset, length).then(result => {
                    let addresses = result[0];
                    let balances = result[1];
                    let map = new Map();
                    for (let key in addresses) {
                        if (addresses.hasOwnProperty(key) && balances.hasOwnProperty(key)
                            && !this.isEmptyAddress(addresses[key])) {
                            map = map.set(addresses[key], balances[key].toNumber());
                        }
                    }
                    resolve(map);
                });
            });
        });

    };

    isTokenAdded = (proxyAddress) => {
        return new Promise(resolve => {
            this.contract.then(deployed => {
                deployed.getContracts.call().then(contracts => {
                    for (let key in contracts) {
                        if (contracts.hasOwnProperty(key)) {
                            if (contracts[key] === proxyAddress) {
                                resolve(true);
                                return;
                            }
                        }
                    }
                    resolve(false);
                });
            });
        });
    };

    /**
     * @param current will be removed from list
     * @param newAddress proxy or asset
     * @param account from
     * @return {Promise.<bool>} result
     */
    treatToken = (current: TokenContractModel, newAddress: string, account: string) => {
        return new Promise(resolve => {
            if (current.address() === newAddress || current.proxyAddress() === newAddress) {
                resolve(false);
            }
            const callback = (proxyAddress) => {
                this.isTokenAdded(proxyAddress).then(isTokenAdded => {
                    if (isTokenAdded) { // to prevent overriding of already added addresses
                        resolve(false);
                        return;
                    }
                    this.initProxyDAO(proxyAddress).then(() => {
                        this.contract.then(deployed => {
                            const params = {from: account, gas: 3000000};
                            if (current.address()) {
                                deployed.changeAddress(current.proxyAddress(), proxyAddress, params).then(() => resolve(true));
                            } else {
                                deployed.setAddress(proxyAddress, params).then(() => resolve(true));
                            }
                        });
                    }).catch(() => resolve(false));
                });
            };
            // we need to know whether the newAddress is proxy or asset
            this.initAssetDAO(newAddress).then(asset => {
                asset.getProxyAddress()
                    .then(proxyAddress => callback(proxyAddress))
                    .catch(() => callback(newAddress));
            }).catch(() => resolve(false));
        });
    };

    /**
     * @param token
     * @param account
     * @return {Promise.<bool>} result
     */
    removeToken = (token: TokenContractModel, account: string) => {
        return new Promise(resolve => {
            this.contract.then(deployed => {
                deployed.removeAddress(token.proxyAddress(), {from: account, gas: 3000000}).then(() => resolve(true));
            });
        });
    };

    /** @param callback will receive TokenContractModel */
    watchUpdateToken = (callback) => {
        this.contract.then(deployed => {
            this.watch(deployed.updateContract, (result, block, ts) => {
                const proxyAddress = result.args.contractAddress;
                this.initProxyDAO(proxyAddress, block).then(proxy => {
                    proxy.getLatestVersion().then(address => {
                        proxy.getName().then(name => {
                            proxy.getSymbol().then(symbol => {
                                this.isTokenAdded(proxyAddress).then(isTokenAdded => {
                                    callback(new TokenContractModel({
                                        address: address,
                                        proxy: proxyAddress,
                                        name,
                                        symbol
                                    }), ts, !isTokenAdded);
                                });
                            });
                        });
                    });
                });
            });
        });
    };


    /**
     * OTHER CONTRACTS
     ***********************************************
     *
     * @return {Promise.<Map[string,AbstractOtherContractModel]>} associated with contract address
     */
    getOtherContracts = () => {
        return new Promise(resolve => {
            this.contract.then(deployed => {
                deployed.getOtherContracts.call().then(contracts => {
                    let map = new Map();
                    const callback = (model: AbstractOtherContractModel) => {
                        map = map.set(model.address(), model);
                        if (map.size === contracts.length) {
                            resolve(map);
                        }
                    };
                    const getModel = (address: string) => {
                        return new Promise((resolve, reject) => {
                            const types = this.getOtherDAOsTypes();
                            let counter = 0;
                            const next = (e) => {
                                counter++;
                                if (counter === types.length) {
                                    reject(e);
                                }
                            };
                            const isValid = (type) => {
                                if (this.getDAOs()[type].getJson().unlinked_binary.replace(/606060.*606060/, '606060')
                                    == this.web3.eth.getCode(address)) {
                                    this.initDAO(type, address).then(dao => {
                                        resolve(dao.getContractModel());
                                    }).catch(() => next('init error'));
                                } else {
                                    next('code error');
                                }
                            };
                            for (let key in types) {
                                if (types.hasOwnProperty(key)) {
                                    isValid(types[key]);
                                }
                            }
                        });
                    };
                    for (let j in contracts) {
                        if (contracts.hasOwnProperty(j)) {
                            getModel(contracts[j])
                                .then(callback)
                                .catch(() => 'skip');
                        }
                    }
                });
            });
        });
    };
}

export default new AppDAO();