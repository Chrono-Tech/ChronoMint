import DAO from './DAO';
import EventHistory from '../contracts/EventsHistory.sol';

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