import { abstractContractModel } from './AbstractContractModel'

class AbstractOtherContractModel extends abstractContractModel({
  settings: {},
  isUnknown: false
}) {
  constructor (address: string, id: number) {
    if (new.target === AbstractOtherContractModel) {
      throw new TypeError('Cannot construct AbstractOtherContractModel instance directly')
    }
    super({address, id})
  }

  /** @returns {Promise.<AbstractOtherContractDAO>} */
  dao () {
    throw new Error('should be overridden')
  }

  settings () {
    return this.get('settings')
  }

  /**
   * If contract has editable settings, then this method should be overridden and returns JSX of settings redux form.
   * Form should use provided ref and onSubmit handler.
   * @param ref
   * @param onSubmit
   * @returns {null|jsx}
   */
  form (ref, onSubmit) {
    return null
  }

  fetching (isUnknown: boolean = false) {
    const fetching = this.set('isFetching', true)
    return isUnknown ? fetching.set('isUnknown', true) : fetching
  }

  isUnknown () {
    return this.get('isUnknown')
  }
}

export default AbstractOtherContractModel
