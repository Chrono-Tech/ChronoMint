import DAO from './DAO';
import EventHistoryDAO from './EventHistoryDAO';
import contract from 'truffle-contract';
import ChronoBankPlatformJSON from 'contracts/ChronoBankAssetProxy.json';
import ChronoBankPlatformEmitterJSON from 'contracts/ChronoBankAssetProxy.json';

let ChronoBankPlatform = contract(ChronoBankPlatformJSON);
let ChronoBankPlatformEmitter = contract(ChronoBankPlatformEmitterJSON);

class PlatformDAO extends DAO {
    constructor() {
        super();
        ChronoBankPlatform.setProvider(this.web3.currentProvider);
        ChronoBankPlatformEmitter.setProvider(this.web3.currentProvider);

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
        return this.emitter.then(instance => instance.allEvents().watch(callback));
    };

    watchTransfer = (callback) => {
        return this.emitter.Transfer().watch(callback);
    }
}

export default new PlatformDAO();