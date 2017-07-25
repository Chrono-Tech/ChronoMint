import AbstractContractDAO from './AbstractContractDAO'

class LHTDAO extends AbstractContractDAO {
  constructor () {
    super(require('chronobank-smart-contracts/build/contracts/ChronoBankAssetWithFeeProxy.json'))
  }

  getSymbol () {
    return 'LHT'
  }
}

export default new LHTDAO()
