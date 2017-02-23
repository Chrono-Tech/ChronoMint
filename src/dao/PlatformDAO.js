import DAO from './DAO';
import AppDAO from './AppDAO';
import EventHistoryDAO from './EventHistoryDAO';
import contract from 'truffle-contract';

class PlatformDAO extends DAO {
    constructor() {
        super();

        const ChronoBankPlatform = contract(require('../contracts/ChronoBankPlatform.json'));
        ChronoBankPlatform.setProvider(this.web3.currentProvider);
        this.contract = ChronoBankPlatform.deployed();

        const ChronoBankPlatformEmitter = contract(require('../contracts/ChronoBankPlatformEmitter.json'));
        ChronoBankPlatformEmitter.setProvider(this.web3.currentProvider);
        this.emitter = ChronoBankPlatformEmitter.deployed();
    }

    setupEventsHistory = () => {
        return Promise.all(EventHistoryDAO.getAddress(), AppDAO.getAddress())
            .then(res => {
                this.contract.then(deployed => {
                    deployed.setupEventsHistory(res[0], {from: res[1]});
                });
            });
    };

    issueAsset = (symbol, value, name, description, baseUnit, isReusable) => {
        return this.contract.then(deployed => {
            AppDAO.getAddress().then(mintAddress => {
                deployed.issueAsset(symbol, value, name, description, baseUnit, isReusable, {
                    from: mintAddress,
                    gas: 3000000
                });
            });
        })
    };

    setProxy = (address, symbol) => {
        return AppDAO.getAddress().then(mintAddress => {
            this.contract.then(deployed => {
                deployed.setProxy(address, symbol, {from: mintAddress})
            });
        });
    };

    getHoldersCount = () => {
        return this.contract.then(deployed => {
            return deployed.holdersCount.call().then(value => value.toNumber());
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