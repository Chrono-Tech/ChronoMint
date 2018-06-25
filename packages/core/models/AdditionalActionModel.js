/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractFetchingModel } from './AbstractFetchingModel'

class AdditionalActionModel extends abstractFetchingModel({
  action: null,
  value: null,
  errorMessage: null,
  repeatButtonName: null,
}) {
  async action () {
    const action = this.get('action')
    if (!this.get('action')) {
      return this
    } else {
      try {
        const result = await action()
        return this.value(result).isFetched(true).isFailed(false)
      } catch (e) {
        // eslint-disable-next-line
        console.warn(e.message)
        return this.isFailed(true).isFetched(false)
      }
    }
  }

  value (value) {
    return this._getSet('value', value)
  }

  errorMessage (value) {
    return this._getSet('errorMessage', value)
  }

  repeatButtonName (value) {
    return this._getSet('repeatButtonName', value)
  }
}

export default AdditionalActionModel
