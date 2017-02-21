import AbstractProxyDAO from './AbstractProxyDAO';
import contract from 'truffle-contract';
import isEthAddress from '../utils/isEthAddress';

const json = require('../contracts/ChronoBankAssetProxy.json');
const ChronoBankAssetProxy = contract(json);

export default class ProxyDAO extends AbstractProxyDAO {
    constructor(address) {
        super();
        ChronoBankAssetProxy.setProvider(this.web3.currentProvider);

        this.contractDeployed = null;
        this.deployError = isEthAddress(address) ? null : 'invalid address passed';

        if (this.deployError == null) {
            ChronoBankAssetProxy.at(address)
                .then(deployed => this.contractDeployed = deployed)
                .catch(e => this.deployError = e);
        }

        this.contract = new Promise((resolve, reject) => {
            let interval = null;
            let callback = () => {
                if (this.contractDeployed) {
                    clearInterval(interval);
                    resolve(this.contractDeployed);
                }

                if (this.deployError) {
                    reject(this.deployError);
                }
            };
            callback();
            interval = setInterval(callback, 100);
        });
    }
}