/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { isArray, isObject, isMap, isSet, isEmpty, isString, isNil } from 'lodash'
import { I18n } from 'react-redux-i18n'
import wallet from 'ethereumjs-wallet'
import Web3 from 'web3'

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

export const required = (value) => {
  return value
    ? null
    : 'validator.required'
}

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
