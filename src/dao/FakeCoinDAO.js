import FakeCoinABI from 'chronobank-smart-contracts/build/contracts/FakeCoin.json'
import AbstractContractDAO from './AbstractContractDAO'

class FakeCoinDAO extends AbstractContractDAO {
  constructor () {
    super(FakeCoinABI)
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

export default new FakeCoinDAO()
