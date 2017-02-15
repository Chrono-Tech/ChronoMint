import AbstractProxyDAO from './AbstractProxyDAO';
import contract from 'truffle-contract';

const json = require('../contracts/ChronoBankAssetProxy.json');
const ChronoBankAssetProxy = contract(json);

class TimeProxyDAO extends AbstractProxyDAO {
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

    transfer = (amount, recipient, sender) => {
        return this.contract.then(deploy => deploy.transfer(recipient, amount * 100, {from: sender, gas: 3000000}));
    };
}

export default new TimeProxyDAO();