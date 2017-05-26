import AbstractProxyDAO from './AbstractProxyDAO'

class LHTProxyDAO extends AbstractProxyDAO {
  watchTransferPlain (callback) {
    return this._watch('Transfer', () => {
      callback()
    }, false)
  }
}

export default new LHTProxyDAO(require('chronobank-smart-contracts/build/contracts/ChronoBankAssetWithFeeProxy.json'))
