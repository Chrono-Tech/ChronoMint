import DAO from './DAO';
import ChronoBankAssetProxy from '../contracts/ChronoBankAssetProxy.sol';

class TimeProxyDAO extends DAO {
    constructor() {
        super();
        ChronoBankAssetProxy.setProvider(this.web3.currentProvider);

        this.contract = ChronoBankAssetProxy.deployed();
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

export default new TimeProxyDAO();