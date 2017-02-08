import DAO from './DAO';
import contract from 'truffle-contract';
import EventsHistoryJSON from 'contracts/EventsHistory.json';

// TODO Contract name is EventsHistory, not EventHistory

let EventHistory = contract(EventsHistoryJSON);

class EventHistoryDAO extends DAO {
    constructor() {
        super();
        EventHistory.setProvider(this.web3.currentProvider);

        this.contract = EventHistory.deployed();
    }

    addEmitter = (signature, platformEmitterAddress) => {
        return this.contract.addEmitter(signature, platformEmitterAddress, {from: this.getMintAddress()});
    };
}

export default new EventHistoryDAO();