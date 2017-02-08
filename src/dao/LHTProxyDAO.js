import DAO from './DAO';
import contract from 'truffle-contract';
import ChronoBankAssetWithFeeProxyJSON from 'contracts/ChronoBankAssetWithFeeProxy.json';

let ChronoBankAssetWithFeeProxy = contract(ChronoBankAssetWithFeeProxyJSON);

class LHTProxyDAO extends DAO {
    constructor() {
        super();
        ChronoBankAssetWithFeeProxy.setProvider(this.web3.currentProvider);

        this.contract = ChronoBankAssetWithFeeProxy.deployed();
    }

    initProxy = (address, symbol, name) => {
        return this.contract.init(address, symbol, name, {from: this.getMintAddress()});
    };

    proposeUpgrade = () => {
        return this.contract.proposeUpgrade(this.time.address, {from: this.getMintAddress()});
    };

    totalSupply = (symbol) => {
        return this.contract.totalSupply(symbol);
    };

    transfer = (amount, recipient, sender) => {
        return this.contract.transfer(recipient, amount, {from: sender, gas: 3000000});
    };

    getAccountBalance = (account) => {
        return this.contract.balanceOf(account);
    };
}

export default new LHTProxyDAO();