import { abstractModel } from './AbstractModel'

export const abstractFetchingModel = (defaultValues) => class AbstractFetchingModel extends abstractModel({
  isFetching: false,
  isFetched: false,
  transactionHash: null,
  isPending: false,
  isFailed: false,
  ...defaultValues,
}) {
  isFetching (value) {
    return this._getSet('isFetching', value)
  }

  isFetched (value) {
    return this._getSet('isFetched', value)
  }

  transactionHash (value) {
    return this._getSet('transactionHash', value)
  }

  isTransactionHash () {
    return !!this.transactionHash()
  }

  isPending (value) {
    if (value === undefined) {
      return this.get('isPending')
    } else {
      return this.set('isFailed', false).set('isPending', value)
    }
  }

  isFailed (value) {
    if (value === undefined) {
      return this.get('isFailed')
    } else {
      return this.set('isFailed', value).set('isPending', false)
    }
  }
}

export default abstractFetchingModel()
