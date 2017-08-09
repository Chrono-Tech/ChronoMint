import { Record as record } from 'immutable'

//noinspection JSUnusedLocalSymbols
export const abstractModel = defaultValues => class AbstractModel extends record({
  ...defaultValues
}) {
  summary (): Object {
    return this.toJS()
  }

  toJS () {
    return super.toJS()
  }

  _getSet (key, value) {
    return value === undefined ? this.get(key) : this.set(key, value)
  }
}

export default abstractModel()
