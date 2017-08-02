import { abstractModel } from './AbstractModel'

export const abstractFetchingModel = defaultValues => class AbstractFetchingModel extends abstractModel({
  ...defaultValues,
  isFetching: false
}) {
  isFetching () {
    return this.get('isFetching')
  }

  fetching (): AbstractFetchingModel {
    return this.set('isFetching', true)
  }

  notFetching (): AbstractFetchingModel {
    return this.set('isFetching', false)
  }
}

export default abstractFetchingModel()
