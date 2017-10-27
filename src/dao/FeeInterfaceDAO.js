import AbstractContractDAO from './AbstractContractDAO'

export default class FeeInterfaceDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(require('chronobank-smart-contracts/build/contracts/FeeInterface.json'), at)
  }

  getFeePercent () {
    return this._call('feePercent')
  }

}
