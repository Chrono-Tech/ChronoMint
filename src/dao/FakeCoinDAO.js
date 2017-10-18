import AbstractContractDAO from './AbstractContractDAO'

class FakeCoinDAO extends AbstractContractDAO {
  constructor() {
    super(require('chronobank-smart-contracts/build/contracts/FakeCoin.json'))
  }

  subscribeOnReset() {
    this._web3Provider.onResetPermanent(() => this.handleWeb3Reset())
  }

  handleWeb3Reset() {
    if (this.contract) {
      this.contract = this._initContract()
    }
  }
}

export default new FakeCoinDAO()
