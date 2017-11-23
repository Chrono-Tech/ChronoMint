export const required = (value) => !value ? 'errors.required' : null

export const address = (value, required = true) => {
  if ((!value && required) || (value && !/^0x[0-9a-f]{40}$/i.test(value))) {
    return 'errors.invalidAddress'
  }
  return null
}

export const bitcoinAddress = (value, required = true) => {
  // TODO @ipavlenko: Provide better validation
  if ((!value && required) || (value && !/^[a-km-zA-HJ-NP-Z1-9]{24,34}$/.test(value))) {
    return 'errors.invalidAddress'
  }
  return null
}

export const name = (value, required = true) => {
  if (value && !/^[A-z]/.test(value)) {
    return 'errors.invalidLatinString'
  }
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
    return 'errors.invalidURL'
  }
  return null
}

export const positiveInt = (value) => {
  if (!/^[1-9][\d]*$/.test(value)) {
    return 'errors.invalidPositiveInt'
  }
  return null
}

export const between = (value, min, max, required = true) => {
  if (!required && value === '') {
    return null
  }
  if (isNaN(value) || value < min || value > max) {
    return { value: 'errors.between', min, max }
  }
  return null
}

export const positiveNumber = (value) => isNaN(value) || !(value > 0) ? 'errors.invalidPositiveNumber' : null

export const positiveNumberOrZero = (value) => isNaN(value) || !(value >= 0) ? 'errors.invalidPositiveNumberOrZero' : null

export const validIpfsFileList = (value) => (!!value && value.indexOf('!') === 0)
  // '!' marks partially uploaded or inconsistent objects
  ? 'errors.validIpfsFileList'
  : null

export const currencyNumber = (value, decimals) => {
  const invalidPositiveNumber = positiveNumber(value)
  if (!invalidPositiveNumber) {
    const matcher = new RegExp(`^\\d+${decimals > 0 ? `(\\.\\d{1,${decimals}})?` : ''}$`)
    return !matcher.test(value) ? {
      value: 'errors.invalidCurrencyNumber',
      decimals,
    } : null
  }
  return invalidPositiveNumber
}

export function lowerThan (value, limit, strict = false) {
  const result = strict ? value >= limit : value > limit
  return result ? {
    value: strict ? 'errors.lowerThanOrEqual' : 'errors.lowerThan',
    limit,
  } : null
}

export function moreThan (value, limit, strict = false) {
  const result = strict ? value <= limit : value < limit
  return result ? {
    value: strict ? 'errors.moreThanOrEqual' : 'errors.moreThan',
    limit,
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
  positiveNumberOrZero,
  currencyNumber,
  lowerThan,
  moreThan,
  validIpfsFileList,
}
