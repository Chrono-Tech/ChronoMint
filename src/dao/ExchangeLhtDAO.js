import DAO from './dao';
import AssetWithFee from '../contracts/ChronoBankAssetWithFee.sol';
import Exchange from '../contracts/Exchange.sol';

const SELL_PRICE = 3;
const BUY_PRICE = 2;

class ExchangeLhtDAO extends DAO {
    constructor() {
        super();
        Exchange.setProvider(this.web3.currentProvider);
        AssetWithFee.setProvider(this.web3.currentProvider);

        this.contract = Exchange.deployed();

        this.init(AssetWithFee.deployed().address);

        this.setPrices(BUY_PRICE, SELL_PRICE);
    }

    init = (coinAddress) => {
        return this.contract.init(coinAddress, {from: this.web3.eth.accounts[0]});
    };

    setPrices = (buyPrice, sellPrice) => {
        return this.contract.setPrices(buyPrice, sellPrice, {from: this.web3.eth.accounts[0]});
    };

    getBuyPrice = () => {
        return this.contract.buyPrice({from: this.web3.eth.accounts[0]});
    };

    getSellPrice = () => {
        return this.contract.sellPrice({from: this.web3.eth.accounts[0]});
    };

    sell = (amount, price, address) => {
        return this.contract.sell(
            amount,
            price,
            {from: address, gas: 3000000});
    };

    buy = (amount, price, address) => {
        return this.contract.buy(amount, price, {from: address, gas: 3000000});
    }
}

export default new ExchangeLhtDAO();