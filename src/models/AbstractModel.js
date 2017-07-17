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
}

export default abstractModel()
