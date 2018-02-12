import { abstractFetchingModel } from './AbstractFetchingModel'

class AdditionalActionModel extends abstractFetchingModel({
  action: null,
  value: null,
  callback: null,
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
        return this.value(result).isFetched(true)
      } catch (e) {
        return this.isFailed(true)
      }
    }
  }

  value (value) {
    return this._getSet('value', value)
  }

  callback (value) {
    return this._getSet('value', value)
  }

  message (value) {
    return this._getSet('value', value)
  }
}

export default AdditionalActionModel
