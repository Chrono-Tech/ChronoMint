import ERC20DAO from './ERC20DAO'

class LHTProxyDAO extends ERC20DAO {
  constructor () {
    super(null, require('chronobank-smart-contracts/build/contracts/ChronoBankAssetWithFeeProxy.json'))
    this.setDecimals(8) // TODO
  }
}

export default new LHTProxyDAO()
