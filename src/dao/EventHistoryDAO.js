import DAO from './DAO';
import contract from 'truffle-contract';

const json = require('../contracts/EventsHistory.json');
const EventHistory = contract(json);

class EventHistoryDAO extends DAO {
    constructor() {
        super();
        EventHistory.setProvider(this.web3.currentProvider);
        EventHistory.deployed().then((deployed) => this.contract = deployed);
    }

    addEmitter = (signature, platformEmitterAddress) => {
        return this.getMintAddress()
            .then(address => this.contract.then(deployed => deployed.addEmitter(signature, platformEmitterAddress, {from: address})));
    };
}

export default new EventHistoryDAO();