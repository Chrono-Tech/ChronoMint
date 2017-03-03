import AbstractContractDAO from './AbstractContractDAO';
import AppDAO from './AppDAO';

class EventHistoryDAO extends AbstractContractDAO {
    addEmitter = (signature, platformEmitterAddress) => {
        return AppDAO.getAddress().then(address => {
            this.contract.then(deployed => {
                deployed.addEmitter(signature, platformEmitterAddress, {from: address});
            })
        });
    };
}

export default new EventHistoryDAO(require('../contracts/EventsHistory.json'));