import { abstractModel } from './AbstractModel'

export const abstractFetchingModel = defaultValues => class AbstractFetchingModel extends abstractModel({
  ...defaultValues,
  isFetching: false
}) {
  constructor (data) {
    if (new.target === AbstractFetchingModel) {
      throw new TypeError('Cannot construct AbstractFetchingModel instance directly')
    }
    super(data)
  }

  isFetching () {
    return this.get('isFetching')
  }

  fetching () {
    return this.set('isFetching', true)
  }

  notFetching () {
    return this.set('isFetching', false)
  }
}

export default abstractFetchingModel()
