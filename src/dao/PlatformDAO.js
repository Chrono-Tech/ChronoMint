import DAO from './dao';
import EventHistoryDAO from './EventHistoryDAO';
import TimeProxyDAO from './TimeProxyDAO';
import ChronoBankPlatform from '../contracts/ChronoBankPlatform.sol'

class PlatformDAO extends DAO {
    constructor() {
        super();
        ChronoBankPlatform.setProvider(this.web3.currentProvider);

        this.contract = ChronoBankPlatform.deployed();
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

    setProxy = (symbol) => {
        return this.contract.setProxy(TimeProxyDAO.getAddress(), symbol, {from: this.getMintAddress()})
    };
}

export default new PlatformDAO();