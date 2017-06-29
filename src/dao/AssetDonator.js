import AbstractContractDAO from './AbstractContractDAO'

const REQUIRE_TIME = 'sendTime'

export default class AssetDonator extends AbstractContractDAO {
  constructor () {
    super(require('chronobank-smart-contracts/build/contracts/AssetDonator.json'))
  }

  requireTIME () {
    return this._tx(REQUIRE_TIME)
  }
}
