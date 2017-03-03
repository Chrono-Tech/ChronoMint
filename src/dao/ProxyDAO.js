import AbstractProxyDAO from './AbstractProxyDAO';

export default class ProxyDAO extends AbstractProxyDAO {
    constructor(at, block = 'latest') {
        super(require('../contracts/ChronoBankAssetProxy.json'), at);
        this.web3.eth.defaultBlock = block;
    }
}