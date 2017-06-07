export const required = (value) => {
  return !value ? 'errors.required' : null
}

export const address = (value, required = true) => {
  if ((!value && required) || (value && !/^0x[0-9a-f]{40}$/i.test(value))) {
    return 'errors.invalidAddress'
  }
  return null
}

export const name = (value, required = true) => {
  if ((!value && required) || (value && value.length < 3)) {
    return 'errors.invalidLength'
  }
  return null
}

export const email = (value, required = true) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if ((!value && required) || (value && !re.test(value))) {
    return 'errors.invalidEmail'
  }
  return null
}

export const url = (value, required = true) => {
  const re = /(http(s)?:\/\/)?[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  if ((!value && required) || (value && !re.test(value))) {
    return 'errors.invalidUrl'
  }
  return null
}

export const positiveInt = value => {
  if (!/^[1-9][\d]*$/.test(value)) {
    return 'errors.invalidPositiveNumber'
  }
  return null
}

export const between = (value, min, max, required = true) => {
  if (!required && value === '') {
    return null
  }
  if (isNaN(value) || value < min || value > max) {
    return {value: 'errors.between', min, max}
  }
  return null
}

export const positiveNumber = value => {
  return isNaN(value) || !(value > 0) ? 'errors.invalidPositiveNumber' : null
}

export const currencyNumber = (value, decimals) => {
  const invalidPositiveNumber = positiveNumber(value)
  if (!invalidPositiveNumber) {
    const matcher = new RegExp('^\\d+' + (decimals > 0 ? '(\\.\\d{1,' + decimals + '})?' : '') + '$')
    return !matcher.test(value) ? 'errors.invalidCurrencyNumber' : null
  } else {
    return invalidPositiveNumber
  }
}

export function lowerThan (value, limit) {
  return value > limit ? {
    value: 'errors.lowerThan',
    limit
  } : null
}

export default {
  required,
  address,
  name,
  email,
  url,
  positiveInt,
  between,
  positiveNumber,
  currencyNumber,
  lowerThan
}
