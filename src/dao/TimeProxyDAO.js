import AbstractProxyDAO from './AbstractProxyDAO';
import AppDAO from './AppDAO';
import contract from 'truffle-contract';

class TimeProxyDAO extends AbstractProxyDAO {
    constructor() {
        super();
        const ChronoBankAssetProxy = contract(require('../contracts/ChronoBankAssetProxy.json'));
        ChronoBankAssetProxy.setProvider(this.web3.currentProvider);
        this.contract = ChronoBankAssetProxy.deployed();
    }

    proposeUpgrade = () => {
        return AppDAO.getAddress().then(address => {
            this.contract.then(deployed => deployed.proposeUpgrade(this.time.address, {from: address}));
        });
    };

    transfer = (amount, recipient, sender) => {
        return this.contract.then(deploy => deploy.transfer(recipient, amount * 100, {from: sender, gas: 3000000}));
    };
}

export default new TimeProxyDAO();