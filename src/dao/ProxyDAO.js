import AbstractProxyDAO from './AbstractProxyDAO';

export default class ProxyDAO extends AbstractProxyDAO {
    constructor(at) {
        super(require('../contracts/ChronoBankAssetProxy.json'), at);
    }
}