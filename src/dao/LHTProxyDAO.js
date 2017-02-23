import AbstractProxyDAO from './AbstractProxyDAO';
import AppDAO from './AppDAO';
import contract from 'truffle-contract';

class LHTProxyDAO extends AbstractProxyDAO {
    constructor() {
        super();
        const ChronoBankAssetWithFeeProxy = contract(require('../contracts/ChronoBankAssetWithFeeProxy.json'));
        ChronoBankAssetWithFeeProxy.setProvider(this.web3.currentProvider);
        this.contract = ChronoBankAssetWithFeeProxy.deployed();
    }

    proposeUpgrade = () => {
        return AppDAO.getAddress().then(address => {
            this.contract.then(deployed => deployed.proposeUpgrade(this.time.address, {from: address}));
        });
    };

    transfer = (amount, recipient, sender) => {
        return this.contract.then(deployed => deployed.transfer(recipient, amount * 100, {from: sender, gas: 3000000}));
    };

    approve = (address, amount, account) => {
        return this.contract.then(deployed => deployed.approve(address, amount, {from: account, gas: 3000000}));
    }
}

export default new LHTProxyDAO();