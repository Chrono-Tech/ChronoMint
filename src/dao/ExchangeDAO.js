import DAO from './DAO';
import LHTProxyDAO from './LHTProxyDAO';

import contract from 'truffle-contract';
const jsonExchange = require('../contracts/Exchange.json');
const jsonLHT = require('../contracts/ChronoBankAssetWithFee.json');

const Exchange = contract(jsonExchange);
const LHT = contract(jsonLHT);

class ExchangeDAO extends DAO {
    constructor() {
        super();
        Exchange.setProvider(this.web3.currentProvider);
        LHT.setProvider(this.web3.currentProvider);

        this.contract = Exchange.deployed();
    }

    init = (assetAddress: string, account: string) => {
        return this.contract.then(deployed => deployed.init(assetAddress, {from: account}));
    };

    initLHT = (account) => {
        return LHT.deployed().then(deployed => {return deployed.address})
            .then((address) => {
                this.init(address, account);
            });
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

export default new ExchangeDAO();