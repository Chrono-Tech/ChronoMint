import DAO from './DAO';
import contract from 'truffle-contract';

const json = require('../contracts/ChronoBankAsset.json');
const ChronoBankAsset = contract(json);

class TimeDAO extends DAO {
    constructor() {
        super();
        ChronoBankAsset.setProvider(this.web3.currentProvider);
        this.contract = ChronoBankAsset.deployed();
    }

    init = (timeProxyAddress) => {
        return this.getMintAddress().then(address => {
            this.contract.then(deploy => deploy.init(timeProxyAddress, {from: address}));
        });
    };
}

export default new TimeDAO();