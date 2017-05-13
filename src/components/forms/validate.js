import React from 'react'
import { Translate } from 'react-redux-i18n'

export const required = (value) => {
  if (!value) {
    return 'Required'
  }
  return null
}

export const address = (value, required = true) => {
  if ((!value && required) || (value && !/^0x[0-9a-f]{40}$/i.test(value))) {
    return 'Should be valid ethereum address'
  }
  return null
}

export const name = (value, required = true) => {
  if ((!value && required) || (value && value.length < 3)) {
    return 'Should have length more than or equal 3 symbols'
  }
  return null
}

export const email = (value, required = true) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if ((!value && required) || (value && !re.test(value))) {
    return 'Should be valid email address'
  }
  return null
}

export const url = (value, required = true) => {
  const re = /(http(s)?:\/\/)?[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  if ((!value && required) || (value && !re.test(value))) {
    return 'Should be valid URL'
  }
  return null
}

export const positiveInt = value => {
  if (!/^[1-9][\d]*$/.test(value)) {
    return 'Should be positive integer'
  }
  return null
}

export const positiveNumber = value => {
  if (isNaN(Number(value)) || value <= 0) {
    return 'Should be positive number'
  }
  return null
}

export const currencyNumber = value => {
  return !/^\d+(\.\d{1,2})?$/.test(value) ? <Translate value='errors.currencyNumber' /> : null
}
