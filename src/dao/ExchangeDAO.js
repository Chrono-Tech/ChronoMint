import AbstractOtherContractDAO from './AbstractOtherContractDAO';
import LHTProxyDAO from './LHTProxyDAO';
import ProxyDAO from './ProxyDAO';
import ExchangeContractModel from '../models/contracts/ExchangeContractModel';

export class ExchangeDAO extends AbstractOtherContractDAO {
    constructor(at = null) {
        super(require('../contracts/Exchange.json'), at);
    }

    /** @inheritDoc */
    isValid() {
        return new Promise(resolve => {
            this.getBuyPrice()
                .then(() => resolve(true))
                .catch(() => resolve(false));
        });
    }

    /** @return {Promise.<ExchangeContractModel>} */
    getContractModel() {
        return this.getAddress().then(address => new ExchangeContractModel({address}));
    }

    init = (assetAddress: string, account: string) => {
        return this.contract.then(deployed => deployed.init(assetAddress, {from: account}));
    };

    getTokenSymbol = () => {
        return this.contract.then(deployed => deployed.asset.call())
            .then(assetAddress => new ProxyDAO(assetAddress).getSymbol());
    };

    getBuyPrice = () => {
        return this.contract.then(deployed => deployed.buyPrice.call());
    };

    getSellPrice = () => {
        return this.contract.then(deployed => deployed.sellPrice.call());
    };

    sell = (amount, price, account) => {
        const priceInWei = this.web3.toWei(price, 'ether');
        return this.contract.then(deployed => {
            LHTProxyDAO.approve(deployed.address, amount, account).then(() => {
                deployed.sell(amount, priceInWei, {
                    from: account,
                    gas: 3000000
                });
            });
        });
    };

    buy = (amount, price, account) => {
        const priceInWei = this.web3.toWei(price, 'ether');
        return this.contract.then(deployed =>
            deployed.buy(amount, priceInWei, {
                from: account,
                gas: 3000000,
                value: amount * priceInWei
            }));
    };

    watchError = () => {
        this.contract.then(deployed => deployed.Error().watch((e, r) => {
            console.log(e, r);
        }));
    };

    watchBuy = (callback, address) => {
        this.contract.then(deployed => {
            deployed.Buy({who: address}).watch(callback)
        });
    };

    getBuy = (callback, address, filter = null) => {
        this.contract.then(deployed => {
            deployed.Buy({who: address}, filter).get(callback)
        });
    };

    watchSell = (callback, address) => {
        this.contract.then(deployed => {
            deployed.Sell({who: address}).watch(callback)
        });
    };

    getSell = (callback, address, filter = null) => {
        this.contract.then(deployed => {
            deployed.Sell({who: address}, filter).get(callback)
        });
    };
}

export default new ExchangeDAO();