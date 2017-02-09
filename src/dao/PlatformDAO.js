import DAO from './DAO';
import EventHistoryDAO from './EventHistoryDAO';
import contract from 'truffle-contract';
const jsonPlatform = require('../contracts/ChronoBankPlatform.json');
const jsonEmitter = require('../contracts/ChronoBankPlatformEmitter.json');
const ChronoBankPlatform = contract(jsonPlatform);
const ChronoBankPlatformEmitter = contract(jsonEmitter);

class PlatformDAO extends DAO {
    constructor() {
        super();
        ChronoBankPlatform.setProvider(this.web3.currentProvider);

        this.contract = ChronoBankPlatform.deployed();
        this.emitter = ChronoBankPlatformEmitter.deployed();
    }

    setupEventsHistory = () => {
        return Promise.all(EventHistoryDAO.getAddress(), this.getMintAddress())
            .then(res => {
                this.contract.then(deployed => {
                    deployed.setupEventsHistory(res[0], {from: res[1]});
                });
            });
    };

    issueAsset = (symbol, value, name, description, baseUnit, isReusable) => {
        return this.contract.then(deployed => {
            deployed.issueAsset(symbol, value, name, description, baseUnit, isReusable, {
                from: this.getMintAddress(),
                gas: 3000000
            });
        })
    };

    setProxy = (address, symbol) => {
        return this.getMintAddress().then(mintAddress => {
            this.contract.then(deployed => {
                deployed.setProxy(address, symbol, {from: mintAddress})
            });
        });
    };

    watchAll = (callback) => {
        return this.emitter.then(deployed => deployed.allEvents().watch(callback));
    };

    watchTransfer = (callback) => {
        return this.emitter.then(deployed => deployed.Transfer().watch(callback));
    };
}

export default new PlatformDAO();