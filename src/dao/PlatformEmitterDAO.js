import AbstractContractDAO from './AbstractContractDAO';

class PlatformEmitterDAO extends AbstractContractDAO {
    watchAll = (callback) => {
        return this.contract.then(deployed => deployed.allEvents().watch(callback));
    };

    watchTransfer = (callback) => {
        return this.contract.then(deployed => deployed.Transfer().watch(callback));
    };
}

export default new PlatformEmitterDAO(require('../contracts/ChronoBankPlatformEmitter.json'));