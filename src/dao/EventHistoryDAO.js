import DAO from './DAO';
import AppDAO from './AppDAO';
import contract from 'truffle-contract';

class EventHistoryDAO extends DAO {
    constructor() {
        super();
        const EventHistory = contract(require('../contracts/EventsHistory.json'));
        EventHistory.setProvider(this.web3.currentProvider);
        EventHistory.deployed().then(deployed => {this.contract = deployed});
    }

    addEmitter = (signature, platformEmitterAddress) => {
        return AppDAO.getAddress()
            .then(address => this.contract.then(deployed => deployed.addEmitter(signature, platformEmitterAddress, {from: address})));
    };
}

export default new EventHistoryDAO();