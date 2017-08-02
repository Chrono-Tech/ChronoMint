import AbstractContractDAO from './AbstractContractDAO'

export const TX_REQUIRE_TIME = 'sendTime'

class AssetDonatorDAO extends AbstractContractDAO {
  constructor () {
    super(require('chronobank-smart-contracts/build/contracts/AssetDonator.json'))
  }

  requireTIME () {
    return this._tx(TX_REQUIRE_TIME)
  }

  isTIMERequired (): boolean {
    return this._call('timeDonations', [this.getAccount()])
      .catch(() => false) // no required yet
      .then(r => r)
  }
}

export default new AssetDonatorDAO()
