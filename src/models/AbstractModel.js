import { Record as record } from 'immutable'

export const abstractModel = defaultValues => class AbstractModel extends record({
  ...defaultValues
}) {
  /**
   * @returns {Object}
   */
  summary () {
    return this.toJS()
  }
}

export default abstractModel()
