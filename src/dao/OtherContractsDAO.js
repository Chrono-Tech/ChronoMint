import {Map} from 'immutable';
import DAOFactory from './DAOFactory';
import AbstractContractDAO from './AbstractContractDAO';
import AbstractOtherContractModel from '../models/contracts/AbstractOtherContractModel';

class OtherContractsDAO extends AbstractContractDAO {
    /**
     * @param address of contract
     * @param block
     * @return {Promise.<AbstractOtherContractModel|string>} model or error
     * @private
     */
    _getModel(address: string, block = 'latest') {
        return new Promise((resolve, reject) => {
            const types = DAOFactory.getOtherDAOsTypes();
            let counter = 0;
            const next = (e) => {
                counter++;
                if (counter === types.length) {
                    reject(e);
                }
            };
            const isValid = (type) => {
                if (DAOFactory.getDAOs()[type].getJson().unlinked_binary.replace(/606060.*606060/, '606060')
                    === this.web3.eth.getCode(address)) {
                    DAOFactory.initDAO(type, address, block).then(dao => {
                        resolve(dao.initContractModel());
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

    /** @return {Promise.<Map[string,AbstractOtherContractModel]>} associated with contract address */
    getList() {
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
                    for (let j in contracts) {
                        if (contracts.hasOwnProperty(j)) {
                            this._getModel(contracts[j])
                                .then(callback)
                                .catch(() => 'skip');
                        }
                    }
                    if (!contracts.length) {
                        resolve(map);
                    }
                });
            });
        });
    };

    /**
     * @param address
     * @return {Promise}
     * @private
     */
    _isAdded(address) {
        return new Promise(resolve => {
            this.contract.then(deployed => {
                deployed.getOtherContracts.call().then(contracts => {
                    for (let key in contracts) {
                        if (contracts.hasOwnProperty(key)) {
                            if (contracts[key] === address) {
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

    add(address: string, account: string) {
        return new Promise(resolve => {
            this._isAdded(address).then(isAdded => {
                if (isAdded) {
                    resolve(false);
                    return;
                }
                this._getModel(address).then(() => { // to check contract validity
                    this.contract.then(deployed => {
                        deployed.setOtherAddress(address, {from: account, gas: 3000000}).then((r) => resolve(true));
                    });
                }).catch(() => resolve(false));
            });
        });
    };

    /**
     * @param contract
     * @param account
     * @return {Promise.<bool>} result
     */
    remove(contract: AbstractOtherContractModel, account: string) {
        return new Promise(resolve => {
            this.contract.then(deployed => {
                deployed.removeOtherAddress(contract.address(), {
                    from: account,
                    gas: 3000000
                }).then(() => resolve(true));
            });
        });
    };

    /**
     * @param callback will receive AbstractOtherContractModel, timestamp and revoke flag
     * @see AbstractOtherContractModel
     */
    watch(callback) {
        this.contract.then(deployed => {
            this._watch(deployed.updateOtherContract, (result, block, ts) => {
                const address = result.args.contractAddress;
                this._getModel(address, block).then((model: AbstractOtherContractModel) => {
                    this._isAdded(address).then(isAdded => {
                        callback(model, ts, !isAdded);
                    });
                }).catch(() => 'skip');
            });
        });
    };
}

export default new OtherContractsDAO(require('../contracts/ContractsManager.json'));