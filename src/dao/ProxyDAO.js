import AbstractProxyDAO from './AbstractProxyDAO';
import contract from 'truffle-contract';

const json = require('../contracts/ChronoBankAssetProxy.json');
const ChronoBankAssetProxy = contract(json);

export default class ProxyDAO extends AbstractProxyDAO {
    constructor(address) {
        super();
        ChronoBankAssetProxy.setProvider(this.web3.currentProvider);

        this.contractDeployed = null;
        ChronoBankAssetProxy.at(address).then(deployed => this.contractDeployed = deployed);

        this.contract = new Promise(resolve => {
            let interval = null;
            let callback = () => {
                if (this.contractDeployed) {
                    clearInterval(interval);
                    resolve(this.contractDeployed);
                }
            };
            callback();
            interval = setInterval(callback, 100);
        });
    }
}