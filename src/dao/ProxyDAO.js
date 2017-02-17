import AbstractProxyDAO from './AbstractProxyDAO';
import contract from 'truffle-contract';

const json = require('../contracts/ChronoBankAssetProxy.json');
const ChronoBankAssetProxy = contract(json);

export default class ProxyDAO extends AbstractProxyDAO {
    constructor(address) {
        super();
        ChronoBankAssetProxy.setProvider(this.web3.currentProvider);
        this.contract = ChronoBankAssetProxy.at(address);
    }
}