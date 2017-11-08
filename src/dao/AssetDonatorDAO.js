import AssetDonatorABI from 'chronobank-smart-contracts/build/contracts/AssetDonator.json'
import AbstractContractDAO from './AbstractContractDAO'

export const TX_REQUIRE_TIME = 'sendTime'

class AssetDonatorDAO extends AbstractContractDAO {
  constructor () {
    super(AssetDonatorABI)
  }

  requireTIME () {
    return this._tx(TX_REQUIRE_TIME)
  }

  isTIMERequired (): boolean {
    return this._call('timeDonations', [this.getAccount()])
      .catch(() => false) // no required yet
      .then((r) => r)
  }

  subscribeOnReset () {
    this._web3Provider.onResetPermanent(() => this.handleWeb3Reset())
  }

  handleWeb3Reset () {
    if (this.contract) {
      this.contract = this._initContract()
    }
  }
}

export default new AssetDonatorDAO()
