import AbstractContractDAO from './AbstractContractDAO'

class FakeCoinDAO extends AbstractContractDAO {
  constructor () {
    super(require('chronobank-smart-contracts/build/contracts/FakeCoin.json'))
  }
}

export default new FakeCoinDAO()
