import DAO from './DAO';
import contract from 'truffle-contract';
import ChronoBankAssetJSON from 'contracts/ChronoBankAsset.json';

let ChronoBankAsset = contract(ChronoBankAssetJSON);

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