import DAO from './dao';
import EventHistory from '../contracts/EventsHistory.sol';

class PlatformDAO extends DAO {
    constructor() {
        super();
        EventHistory.setProvider(this.web3.currentProvider);

        this.contract = EventHistory.deployed();

        // TODO: Fix function hash
        this.hash = '0x515c1457';
    }

    addEmitter = (platformEmitterAddress) => {
        return this.contract.addEmitter(this.hash, platformEmitterAddress, {from: this.getMintAddress()});
    }
}

export default new PlatformDAO();