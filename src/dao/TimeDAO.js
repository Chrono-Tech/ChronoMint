import DAO from './DAO';
import AppDAO from './AppDAO';
import contract from 'truffle-contract';

class TimeDAO extends DAO {
    constructor() {
        super();
        const ChronoBankAsset = contract(require('../contracts/ChronoBankAsset.json'));
        ChronoBankAsset.setProvider(this.web3.currentProvider);
        this.contract = ChronoBankAsset.deployed();
    }

    init = (timeProxyAddress) => {
        return AppDAO.getAddress().then(address => {
            this.contract.then(deploy => deploy.init(timeProxyAddress, {from: address}));
        });
    };
}

export default new TimeDAO();