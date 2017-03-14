/*eslint new-cap: ["error", { "capIsNewExceptions": ["Confirmation", "Revoke"] }]*/
import AbstractContractDAO from './AbstractContractDAO';
import OrbitDAO from './OrbitDAO';
import AssetDAO from './AssetDAO';
import ProxyDAO from './ProxyDAO';
import {RewardsDAO} from './RewardsDAO';
import {ExchangeDAO} from './ExchangeDAO';
import UserModel from '../models/UserModel';

const DAO_PROXY = 'proxy';
const DAO_ASSET = 'asset';
export const DAO_REWARDS = 'rewards';
export const DAO_EXCHANGE = 'exchange';

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

    reissueAsset = (asset: string, amount: number, account: string, locAddress: string ) => {
        return this.contract.then(deployed => {
            return deployed.reissueAsset.call(asset, amount, locAddress, {from: account} )
                .then(r => {
                    if (!r) return false;
                    deployed.reissueAsset(asset, amount, locAddress, {from: account, gas: 3000000} );
                    return r;
                })
        })
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

    proposeLOC = (locName: string, website: string, issueLimit: number, publishedHash: string,
                  expDate: number, account: string) => {
        return this.contract.then(deployed =>
            deployed.proposeLOC(locName, website, issueLimit, publishedHash, expDate, {
                from: account,
                gas: 3000000
            })
        );
    };

    removeLOC = (address: string, account: string) => {
        return this.contract.then(deployed => deployed.removeLOC(address, {from: account, gas: 3000000}));
    };

    newLOCWatch = callback => this.contract.then(deployed => {
        const blockNumber = this.web3.eth.blockNumber;
        deployed.newLOC({}, {}, (e, r) => {
            if (r.blockNumber > blockNumber) callback(r.args._LOC);
        });
    });


    // confirmationWatch = (callback, filter = null) => this.contract.then(deployed =>
    //     deployed.Confirmation({}, filter, (e, r) => callback(r.args.operation)));
    //
    newConfirmationWatch = (callback) => this.contract.then(deployed => {
        const blockNumber = this.web3.eth.blockNumber;
        deployed.Confirmation({}, {}, (e, r) => {
            if (r.blockNumber > blockNumber) callback(r.args.operation);
        })
    });

    // revokeWatch = (callback, filter = null) => this.contract.then(deployed =>
    //     deployed.Revoke({}, filter, callback));
    //
    newRevokeWatch = (callback) => this.contract.then(deployed => {
        const blockNumber = this.web3.eth.blockNumber;
        deployed.Revoke({}, {}, (e, r) => {
            if (r.blockNumber > blockNumber) callback(r.args.operation);
        })
    });

    confirmationGet = (callback, filter = null) => this.contract.then(deployed =>
        deployed.Confirmation({}, filter).get(callback));

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
                    OrbitDAO.get(this._bytesToString(result[0]) + this._bytesToString(result[1])).then(data => {
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
                const hash1 = this._toBytes32(hash.substr(0, 32));
                const hash2 = this._toBytes14(hash.substr(32));
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
}

export default new AppDAO();