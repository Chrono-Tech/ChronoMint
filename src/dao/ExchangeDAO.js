import AbstractContractDAO from './AbstractContractDAO';
import LHTProxyDAO from './LHTProxyDAO';

class ExchangeDAO extends AbstractContractDAO {
    init = (assetAddress: string, account: string) => {
        return this.contract.then(deployed => deployed.init(assetAddress, {from: account}));
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

        console.log(amount, priceInWei);
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
    }
}

export default new ExchangeDAO(require('../contracts/Exchange.json'));