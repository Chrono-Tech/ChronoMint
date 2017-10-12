import { Record as record } from 'immutable'

export const abstractModel = defaultValues => class AbstractModel extends record({
  ...defaultValues,
  id: null,
  timestamp: null
}) {

  id () {
    return this.get('id')
  }

  txSummary () {
    return this.toJS()
  }

  summary (): Object {
    return this.toJS()
  }

  _getSet (key, value) {
    return value === undefined ? this.get(key) : this.set(key, value)
  }
}

export default abstractModel()
