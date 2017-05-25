import Validator from 'validatorjs'
import { I18n } from 'react-redux-i18n'

/**
 * Return validator for reduxForm
 * @link https://github.com/skaterdav85/validatorjs#basic-usage
 * @param rules
 * @return {function(*)}
 */
export const declarativeValidator = (rules) => {
  return (model) => {
    const validator = new Validator(model.toJS(), rules)
    if (!validator.passes()) {
      return validator.errors.all()
    }
  }
}

/**
 * @link https://github.com/skaterdav85/validatorjs#registering-custom-validation-rules
 */
export const registryCustomValidators = () => {
  Validator.register('ethereum-address', (value) => { return /^0x[0-9a-f]{40}$/i.test(value) }, I18n.t('errors.invalidAddress'))
}