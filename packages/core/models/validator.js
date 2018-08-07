/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import { isArray, isObject, isMap, isSet, isEmpty, isString, isNil } from 'lodash'
import { I18n } from '@chronobank/core-dependencies/i18n'
import wallet from 'ethereumjs-wallet'
import Web3 from 'web3'

export const required = (value) => !value ? 'errors.required' : null

export const address = (value, required = true, blockchain = 'Ethereum') => {
  if ((!value && required) || (value && !/^0x[0-9a-f]{40}$/i.test(value))) {
    return { value: 'errors.invalidAddress', blockchain }
  }
  return null
}

export const bitcoinAddress = (validateAddress, blockchain) => (value, required = true) => {
  // TODO @ipavlenko: Provide better validation
  if ((!value && required) || (value && !validateAddress(value))) {
    return { value: 'errors.invalidAddress', blockchain }
  }
  return null
}

export const nemAddress = (value, required = true, blockchain = 'NEM') => {
  if ((!value && required) || (value && !/^[a-zA-Z0-9]{40}$/.test(value))) {
    return { value: 'errors.invalidAddress', blockchain }
  }
  return null
}

export const wavesAddress = (value, required = true, blockchain = 'WAVES') => {
  // TODO @mikefluff: Waves address validation
  if (!value && required) {
    return { value: 'errors.invalidAddress', blockchain }
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

export const bytes32 = (value) => {
  return value && value.length > 32 ? 'errors.invalidMaxLength' : null
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

export const urlAddress = (value, required = true) => {
  const re = /^(?:(?:https?|http|wss):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/
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

export function lowerThan (value, limit, isEqual = false) {
  const isPassed = isEqual ? value <= limit : value < limit
  return !isPassed ? {
    value: isEqual ? 'errors.lowerThanOrEqual' : 'errors.lowerThan',
    limit,
  } : null
}

export function moreThan (value, limit, isEqual = false) {
  const isPassed = isEqual ? value >= limit : value > limit
  return !isPassed ? {
    value: isEqual ? 'errors.moreThanOrEqual' : 'errors.moreThan',
    limit,
  } : null
}

export function countsMoreThan (value, limit, isEqual = false) {
  const isPassed = isEqual ? value >= limit : value > limit
  return !isPassed ? {
    value: isEqual ? 'errors.moreThanOrEqual' : 'errors.moreThan',
    limit,
  } : null
}

export function unique (value, origin: Array | Immutable.Map | Immutable.List) {
  if (!origin || !value) {
    return
  }
  const errorToken = 'errors.mustBeUnique'

  if (Array.isArray(origin) || origin instanceof Immutable.Map || origin instanceof Immutable.List) {
    return origin.includes(value)
      ? errorToken
      : null
  }

  // common case
  return origin === value
    ? errorToken
    : null
}

export const confirm2FACode = (value) => isNaN(value) || ('' + value).length !== 6 ? 'errors.invalidConfirm2FACode' : null

export const privateKey = (value) => {
  try {
    wallet.fromPrivateKey(Buffer.from(value, 'hex'))
    return null
  } catch (e) {
    return 'validator.invalidPrivateKey'
  }
}

export const isEthereumAddress = (value) => {
  if (!value || Web3.isAddress(value)) {
    return { value: 'validator.invalidAddress', blockchain: 'Ethereum' }
  }
  return null
}

// export const required = (value) => {
//   return value
//     ? null
//     : 'validator.required'
// }

// eslint-disable-next-line complexity
export const notEmpty = (value) => {
  if (isArray(value) || isObject(value) || isMap(value) || isSet(value)) {
    if (isEmpty(value)) {
      return I18n.t('validator.required')
    }
  }
  if (isString(value)) {
    if (value == null || value === '') {
      return I18n.t('validator.required')
    }
  }
  if (isNil(value)) {
    return I18n.t('validator.required')
  }
  return null
}

export default {
  required,
  address,
  notEmpty,
  isEthereumAddress,
  privateKey,
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
  unique,
  confirm2FACode,
}
