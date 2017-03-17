import {Map} from 'immutable';
import AbstractContractDAO from './AbstractContractDAO';
import OrbitDAO from './OrbitDAO';
import AssetDAO from './AssetDAO';
import ProxyDAO from './ProxyDAO';
import {RewardsDAO} from './RewardsDAO';
import {ExchangeDAO} from './ExchangeDAO';
import LocDAO, {Setting, SettingString, SettingNumber} from './LocDAO';
import PendingManagerDAO from './PendingManagerDAO';
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

    // getLOCbyID = (index: number, account: string) => {
    //     return this.contract.then(deployed => deployed.getLOCbyID.call(index, {from: account}));
    // };
    //
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
    //
    // getLhtBalance = () => {
    //     return this.getBalance(this.lhtEnumIndex);
    // };
    //
    // getTimeBalance = () => {
    //     return this.getBalance(this.timeEnumIndex);
    // };
    //
    // send = (enumIndex: number, to: string, amount: number, account: string) => {
    //     return this.contract.then(deployed => {
    //         deployed.sendAsset(enumIndex, to, amount, {from: account, gas: 3000000});
    //     });
    // };
    //
    // sendLht = (to, amount, account) => {
    //     //this.getAssetProxyIndex();
    //     return this.send(this.lhtEnumIndex, to, amount, account);
    // };
    //
    // sendTime = (to, amount, account) => {
    //     return this.send(this.timeEnumIndex, to, amount, account);
    // };

    setExchangePrices = (buyPrice, sellPrice, account) => {
        return this.contract.then(deployed => deployed.setExchangePrices(buyPrice, sellPrice, {
            from: account,
            gas: 3000000
        }));
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

    signaturesRequired = (account: string) => {
        return this.contract
            .then(deployed => deployed.required.call({from: account}))
            .then(r => r.toNumber());
    };

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

    updateLOC(data: array, account: string) {
        const loc = new LocDAO(data.address);
        this.contract.then(deployed => {

            SettingString.forEach(settingName => {
                if (data[settingName] === undefined) return;
                let value = data[settingName];
                let settingIndex = Setting[settingName];
                loc.getString(settingName, account).then(r => {
                    if (r === value) return;
                    deployed.setLOCString(data.address, settingIndex, this._toBytes32(value), {from: account});
                });
            });

            SettingNumber.forEach(settingName => {
                if (data[settingName] === undefined) return;
                let value = +data[settingName];
                let settingIndex = Setting[settingName];
                loc.getValue(settingName, account).then(r => {
                    if (r.toNumber() === value) return;
                    deployed.setLOCValue(data.address, settingIndex, value, {from: account, gas: 3000000}).then( r => {
                        PendingManagerDAO.confirm(r.logs[0].args.hash,  account);
                    });
                });
            });

            if (data.status) {
                loc.getStatus(account).then(r => {
                    if (r.toNumber() === data.status) return;
                    deployed.setLOCStatus(data.address, data.status, {from: account, gas: 3000000}).then( r => {
                        PendingManagerDAO.confirm(r.logs[0].args.hash,  account);
                    });
                });
            }

            let value = data.publishedHash;
            if (value) {
                const [publishedHash1, publishedHash2] = value.match(/.{1,32}/g);
                loc.getString('publishedHash1', account).then(r => {
                    if (r === publishedHash1) return;
                    deployed.setLOCString(data.address, Setting['publishedHash1'], this._toBytes32(publishedHash1), {from: account});
                    deployed.setLOCString(data.address, Setting['publishedHash2'], this._toBytes32(publishedHash2), {from: account});
                });
            }

        });
        return Promise.resolve(true);
    }

    proposeLOC = (locName: string, website: string, issueLimit: number, publishedHash: string,
                  expDate: number, account: string) => {
        const [publishedHash1, publishedHash2] = publishedHash.match(/.{1,32}/g);

        return this.contract.then(deployed => deployed.proposeLOC(
            this._toBytes32(locName), this._toBytes32(website), issueLimit, this._toBytes32(publishedHash1), this._toBytes32(publishedHash2), expDate, {
                from: account,
                gas: 3000000
            }
        ));
    };

    removeLOC = (address: string, account: string) => {
        return this.contract.then(deployed => deployed.removeLOC(address, {from: account, gas: 3000000}).then( r => {
            PendingManagerDAO.confirm(r.logs[0].args.hash,  account);
        }));
    };

    newLOCWatch = callback => this.contract.then(deployed => {
        const blockNumber = this.web3.eth.blockNumber;
        deployed.newLOC({}, {}, (e, r) => {
            if (r.blockNumber > blockNumber) callback(r.args._LOC);
        });
    });

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