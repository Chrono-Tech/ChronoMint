import { Record as record } from 'immutable'

export const abstractModel = defaultValues => class AbstractModel extends record({
  ...defaultValues
}) {
  constructor (data) {
    if (new.target === AbstractModel) {
      throw new TypeError('Cannot construct AbstractModel instance directly')
    }
    super(data)
  }

  /**
   * @return {Object}
   */
  summary () {
    return this.toJS()
  }
}

export default abstractModel()
