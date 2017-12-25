import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class FeeModel extends abstractFetchingModel({
  fee: null,
  withFee: null,
  feeAddress: null,
}) {
  fee (value) {
    return this._getSet('fee', value)
  }

  withFee (value) {
    return this._getSet('withFee', value)
  }

  feeAddress (value) {
    return this._getSet('feeAddress', value)

  }
}
