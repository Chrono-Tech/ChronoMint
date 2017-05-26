import Validator from 'validatorjs'
import { I18n } from 'react-redux-i18n'

/**
 * Is ethereum address
 */
export const isAddress = (value: string): boolean => {
  return /^0x[0-9a-f]{40}$/i.test(value)
}

export const isPositiveInt = value => {
  return /^[1-9][\d]*$/.test(value)
}

export const isPositiveNumber = value => {
  return !isNaN(Number(value)) && value > 0
}

export const isCurrencyNumber = value => {
  return /^\d+(\.\d{1,2})?$/.test(value)
}

export default {
  isAddress,
  isPositiveInt,
  isPositiveNumber,
  isCurrencyNumber
}

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

    return {}
  }
}

/**
 * @link https://github.com/skaterdav85/validatorjs#registering-custom-validation-rules
 */
export const registryCustomValidators = () => {
  Validator.register('ethereum-address', (value) => { return isAddress(value) }, I18n.t('errors.invalidAddress'))
  Validator.register('positive-number', (value) => { return isPositiveNumber(value) }, I18n.t('errors.invalidPositiveNumber'))
  Validator.register('currency-number', (value) => { return isCurrencyNumber(value) }, I18n.t('errors.invalidCurrencyNumber'))
}

export const overrideValidatorMessages = () => {
  let messages = Validator.getMessages('en')
  messages = {...messages,
    required: 'Required',
    min: {
      numeric: 'Must be at least :min.',
      string: 'Must be at least :min characters.'
    },
    max: {
      numeric: 'May not be greater than :max.',
      string: 'May not be greater than :max characters.'
    }
  }

  Validator.setMessages('en', messages)
}
