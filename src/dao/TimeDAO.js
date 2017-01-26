import DAO from './dao';
import ChronoBankAsset from '../contracts/ChronoBankAsset.sol';

class TimeDAO extends DAO {
    constructor() {
        super();
        ChronoBankAsset.setProvider(this.web3.currentProvider);

        this.contract = ChronoBankAsset.deployed();
    }

    init = (timeProxyAddress) => {
        return this.contract.init(timeProxyAddress, {from: this.getMintAddress()});
    };
}

export default new TimeDAO();