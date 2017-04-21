import AbstractProxyDAO from './AbstractProxyDAO'

class LHTProxyDAO extends AbstractProxyDAO {
}

export default new LHTProxyDAO(require('chronobank-smart-contracts/build/contracts/ChronoBankAssetWithFeeProxy.json'))
