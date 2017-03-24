import {Map} from 'immutable';
import AbstractContractDAO from './AbstractContractDAO';
import OrbitDAO from './OrbitDAO';
import CBEModel from '../models/CBEModel';
import UserModel from '../models/UserModel';

class UserDAO extends AbstractContractDAO {
    constructor() {
        super(require('../contracts/UserManager.json'));

        this.storageContract = this._truffleContract(require('../contracts/UserStorage.json'), true);

        // TODO Use contract from new PendingManager DAO instead of property below
        this.pendingManagerContract = this._truffleContract(require('../contracts/PendingManager.json'), true);
    }

    /**
     * @param account from
     * @param block number
     * @return {Promise.<bool>}
     */
    isCBE(account: string, block = 'latest') {
        return this.storageContract.then(deployed => deployed.getCBE.call(account, {}, block));
    };

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

    /** @return {Promise.<Map[string,CBEModel]>} associated with CBE account address */
    getCBEList() {
        return new Promise(resolve => {
            this.storageContract.then(deployed => {
                deployed.getCBEMembers.call().then(result => {
                    const addresses = result[0];
                    const hashes1 = result[1];
                    const hashes2 = result[2];
                    let map = new Map();
                    const callback = (address, hash) => {
                        OrbitDAO.get(hash).then(data => {
                            const user = new UserModel(data);
                            map = map.set(address, new CBEModel({
                                address: address,
                                name: user.name(),
                                user
                            }));
                            if (map.size === addresses.length) {
                                resolve(map);
                            }
                        })
                    };
                    for (let key in addresses) {
                        if (addresses.hasOwnProperty(key) && hashes1.hasOwnProperty(key)
                            && hashes2.hasOwnProperty(key)) {
                            callback(
                                addresses[key],
                                this._bytesToString(hashes1[key]) + this._bytesToString(hashes2[key])
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
    treatCBE(cbe: CBEModel, account: string) {
        return this.contract.then(deployed => {
            return this.isCBE(cbe.address()).then(isCBE => {
                if (!isCBE) {
                    return deployed.addKey(cbe.address(), {from: account, gas: 3000000}).then(() => true);
                } else {
                    return false;
                }
            });
        }).then(isAdded => {
            return this.getMemberProfile(cbe.address()).then(user => {
                if (cbe.name() === user.name()) {
                    return true;
                }
                user = user.set('name', cbe.name());
                return this.setMemberProfile(cbe.address(), user, false, account).then(() => {
                    if (isAdded) {
                        return true;
                    } else {
                        return cbe.set('user', user);
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
    revokeCBE(cbe: CBEModel, account: string) {
        return new Promise(resolve => {
            this.contract.then(deployed => {
                deployed.revokeKey(cbe.address(), {from: account, gas: 3000000})
                    .then(r => resolve(r.logs[0].args.hash))
                    .catch(() => resolve(false));
            });
        });
    };

    /**
     * @param callback will receive CBEModel, timestamp, isRevoked flag and flag isOld for old events
     * @see CBEModel updated/revoked element
     * @param account from
     */
    watchCBE(callback, account: string) {
        this.contract.then(deployed => {
            this._watch(deployed.cbeUpdate, (result, block, time, isOld) => {
                const address = result.args.key;
                if (address === account) {
                    return;
                }
                this.isCBE(address, block).then(isNotRevoked => {
                    this.getMemberProfile(address, block).then(user => {
                        callback(new CBEModel({
                            address,
                            user,
                            name: user.name()
                        }), time, !isNotRevoked, isOld);
                    });
                });
            }, 'cbeUpdate');
        });
    };

    signaturesRequired = (account: string) => {
        return this.contract
            .then(deployed => deployed.required.call({from: account}))
            .then(r => r.toNumber());
    };

    setRequiredSignatures = (required: number, account: string) => {
        return this.contract.then(deployed => deployed.setRequired(required, {from: account, gas: 3000000}));
    };

}

export default new UserDAO();