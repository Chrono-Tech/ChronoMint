/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Record as record } from 'immutable'

export const abstractModel = (defaultValues) => class AbstractModel extends record({
  id: null,
  timestamp: null,
  ...defaultValues,
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
