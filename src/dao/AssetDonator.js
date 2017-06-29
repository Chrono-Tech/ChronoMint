import AbstractContractDAO from './AbstractContractDAO'

const REQUIRE_TIME = 'sendTime'

class AssetDonator extends AbstractContractDAO {
  constructor () {
    super(require('chronobank-smart-contracts/build/contracts/AssetDonator.json'))
  }

  requireTIME () {
    return this._tx(REQUIRE_TIME)
  }
}

export default new AssetDonator()