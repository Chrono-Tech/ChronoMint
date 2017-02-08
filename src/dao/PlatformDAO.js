import DAO from './DAO';
import EventHistoryDAO from './EventHistoryDAO';
import ChronoBankPlatform from '../contracts/ChronoBankPlatform.sol';
import ChronoBankPlatformEmitter from '../contracts/ChronoBankPlatformEmitter.sol';

class PlatformDAO extends DAO {
    constructor() {
        super();
        ChronoBankPlatform.setProvider(this.web3.currentProvider);

        this.contract = ChronoBankPlatform.deployed();
        this.emitter = ChronoBankPlatformEmitter.deployed();
    }

    setupEventsHistory = () => {
        return this.contract.setupEventsHistory(EventHistoryDAO.getAddress(), {from: this.getMintAddress()});
    };

    issueAsset = (symbol, value, name, description, baseUnit, isReusable) => {
        return this.contract.issueAsset(symbol, value, name, description, baseUnit, isReusable, {
            from: this.getMintAddress(),
            gas: 3000000
        });
    };

    setProxy = (address, symbol) => {
        return this.contract.setProxy(address, symbol, {from: this.getMintAddress()})
    };

    watchAll = (callback) => {
        return this.emitter.allEvents().watch(callback);
    };

    watchTransfer = (callback) => {
        return this.emitter.Transfer().watch(callback);
    }
}

export default new PlatformDAO();