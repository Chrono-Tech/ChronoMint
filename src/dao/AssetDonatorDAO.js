import AbstractContractDAO from './AbstractContractDAO'

export const TX_REQUIRE_TIME = 'sendTime'

class AssetDonatorDAO extends AbstractContractDAO {
  constructor () {
    super(require('chronobank-smart-contracts/build/contracts/AssetDonator.json'))
  }

  requireTIME () {
    return this._tx(TX_REQUIRE_TIME)
  }
}

export default new AssetDonatorDAO()
