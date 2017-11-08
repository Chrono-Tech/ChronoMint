import FeeInterfaceABI from 'chronobank-smart-contracts/build/contracts/FeeInterface.json'
import AbstractContractDAO from './AbstractContractDAO'

export default class FeeInterfaceDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(FeeInterfaceABI, at)
  }

  getFeePercent () {
    return this._call('feePercent')
  }

}
