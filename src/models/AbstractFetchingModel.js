import { abstractModel } from './AbstractModel'

export const abstractFetchingModel = defaultValues => class AbstractFetchingModel extends abstractModel({
  ...defaultValues,
  isFetching: false,
  transactionHash: null,
}) {
  isFetching() {
    return this.get('isFetching')
  }

  fetching(): AbstractFetchingModel {
    return this.set('isFetching', true)
  }

  notFetching(): AbstractFetchingModel {
    return this.set('isFetching', false)
  }

  transactionHash(hash) {
    if (hash !== undefined) {
      return this.set('transactionHash', hash)
    }
    return this.get('transactionHash')
  }
}

export default abstractFetchingModel()
