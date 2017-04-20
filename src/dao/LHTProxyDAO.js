import AbstractProxyDAO from './AbstractProxyDAO'

class LHTProxyDAO extends AbstractProxyDAO {
}

export default new LHTProxyDAO(require('../contracts/ChronoBankAssetWithFeeProxy.json'))
