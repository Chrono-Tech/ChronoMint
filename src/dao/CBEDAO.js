import {Map} from 'immutable';
import AbstractContractDAO from './AbstractContractDAO';
import AppDAO from './AppDAO';
import OrbitDAO from './OrbitDAO';
import CBEModel from '../models/CBEModel';
import UserModel from '../models/UserModel';

class CBEDAO extends AbstractContractDAO {
    /**
     * @param account from
     * @param block number
     * @return {Promise.<bool>}
     */
    isCBE(account: string, block = 'latest') {
        return this.contract.then(deployed => deployed.isAuthorized.call(account, {}, block));
    };

    /** @return {Promise.<Map[string,CBEModel]>} associated with CBE account address */
    getList() {
        return new Promise(resolve => {
            this.contract.then(deployed => {
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
    treat(cbe: CBEModel, account: string) {
        return new Promise(resolve => {
            AppDAO.getMemberProfile(cbe.address()).then(user => {
                user = user.set('name', cbe.name());
                AppDAO.setMemberProfile(cbe.address(), user, false, account).then(() => {
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
    revoke(cbe: CBEModel, account: string) {
        return new Promise(resolve => {
            this.contract.then(deployed => {
                deployed.revokeKey(cbe.address(), {from: account, gas: 3000000}).then(() => {
                    this.isCBE(cbe.address()).then(result => resolve(true));
                });
            });
        });
    };

    /**
     * @param callback will receive CBEModel, timestamp and revoke flag
     * @see CBEModel updated/revoked element
     * @param account from
     */
    watch(callback, account: string) {
        this.contract.then(deployed => {
            this._watch(deployed.cbeUpdate, (result, block, ts) => {
                const address = result.args.key;
                if (address === account) {
                    return;
                }
                this.isCBE(address, block).then(r => {
                    if (r) { // update
                        AppDAO.getMemberProfile(address, block).then(user => {
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
}

export default new CBEDAO(require('../contracts/ChronoMint.json'));