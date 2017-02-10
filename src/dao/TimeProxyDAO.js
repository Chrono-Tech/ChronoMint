import DAO from './DAO';
import contract from 'truffle-contract';
const json = require('../contracts/ChronoBankAssetProxy.json');
const ChronoBankAssetProxy = contract(json);

class TimeProxyDAO extends DAO {
    constructor() {
        super();
        ChronoBankAssetProxy.setProvider(this.web3.currentProvider);

        this.contract = ChronoBankAssetProxy.deployed();
    }

    initProxy = (address, symbol, name) => {
        return this.getMintAddress().then(address => {
            this.contract.then(deployed => deployed.init(address, symbol, name, {from: address}));
        });
    };

    proposeUpgrade = () => {
        return this.getMintAddress().then(address => {
            this.contract.then(deployed => deployed.proposeUpgrade(this.time.address, {from: address}));
        });
    };

    totalSupply = (symbol) => {
        return this.contract.then(deployed => deployed.totalSupply(symbol));
    };

    transfer = (amount, recipient, sender) => {
        return this.contract.then(deploy => deploy.transfer(recipient, amount, {from: sender, gas: 3000000}));
    };

    getAccountBalance = (account) => {
        return this.contract.then(deploy => deploy.balanceOf(account));
    };
}

export default new TimeProxyDAO();