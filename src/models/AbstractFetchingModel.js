import { abstractModel } from './AbstractModel'

export const abstractFetchingModel = defaultValues => class AbstractFetchingModel extends abstractModel({
  ...defaultValues,
  isFetching: false,
  transactionHash: null,
  isPending: false,
  isFailed: false
}) {
  /**
   * @deprecated use isPending
   */
  isFetching () {
    return this.get('isFetching')
  }
  /**
   * @deprecated
   */
  fetching (): AbstractFetchingModel {
    return this.set('isFetching', true)
  }
  /**
   * @deprecated
   */
  notFetching (): AbstractFetchingModel {
    return this.set('isFetching', false)
  }

  transactionHash (value) {
    return this._getSet('transactionHash', value)
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
