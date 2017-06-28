import AbstractContractDAO from './AbstractContractDAO'

const REQUIRE_TIME = 'sendTime'

export default class AssetDonator extends AbstractContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/AssetDonator.json'), at)
  }

  requireTIME () {
    return this._tx(REQUIRE_TIME)
  }
}
