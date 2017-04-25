import AbstractProxyDAO from './AbstractProxyDAO'

class TIMEProxyDAO extends AbstractProxyDAO {
}

export default new TIMEProxyDAO(require('chronobank-smart-contracts/build/contracts/ChronoBankAssetProxy.json'))
