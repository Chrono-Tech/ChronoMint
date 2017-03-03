import AbstractContractDAO from './AbstractContractDAO';

class PlatformEmitterDAO extends AbstractContractDAO {
    watchAll = (callback) => {
        this.contract.then(deployed => deployed.allEvents().watch(callback));
    };
}

export default new PlatformEmitterDAO(require('../contracts/ChronoBankPlatformEmitter.json'));