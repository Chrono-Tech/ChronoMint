import AbstractProxyDAO from './AbstractProxyDAO'

class TIMEProxyDAO extends AbstractProxyDAO {
}

export default new TIMEProxyDAO(require('../contracts/ChronoBankAssetProxy.json'))
