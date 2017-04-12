import * as validation from '../../components/forms/validate'
import {abstractContractModel} from './AbstractContractModel'

class AbstractOtherContractModel extends abstractContractModel({
  settings: {},
  isFetching: false,
  isUnknown: false
}) {
  constructor (address: string) {
    if (new.target === AbstractOtherContractModel) {
      throw new TypeError('Cannot construct AbstractOtherContractModel instance directly')
    }
    super({address})
  }

  /** @return {Promise.<AbstractOtherContractDAO>} */
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
   * @return {null|jsx}
   */
  form (ref, onSubmit) {
    return null
  }

  isFetching () {
    return this.get('isFetching')
  }

  fetching (isUnknown: boolean = false) {
    const fetching = this.set('isFetching', true)
    return isUnknown ? fetching.set('isUnknown', true) : fetching
  }

  isUnknown () {
    return this.get('isUnknown')
  }
}

export const validate = values => {
  const errors = {}
  errors.address = validation.address(values.get('address'))
  return errors
}

export default AbstractOtherContractModel
