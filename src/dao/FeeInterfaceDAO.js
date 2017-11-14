import { FeeInterfaceABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'

export default class FeeInterfaceDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(FeeInterfaceABI, at)
  }

  getFeePercent () {
    return this._call('feePercent')
  }

}
