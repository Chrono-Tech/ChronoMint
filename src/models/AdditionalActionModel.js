import { abstractFetchingModel } from './AbstractFetchingModel'

class AdditionalActionModel extends abstractFetchingModel({
  action: null,
  value: null,
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
        // eslint-disable-next-line
        console.warn(e.message)
        return this.isFailed(true)
      }
    }
  }

  value (value) {
    this._getSet('value', value)
  }
}

export default AdditionalActionModel
