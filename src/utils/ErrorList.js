/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React from 'react'
import { Translate } from 'react-redux-i18n'

/**
 * Helper class for converting list of errors tokens to strings using <Translate> component
 * You can add params to errors tokens, e.g.:
 * someErrors.add({ value: 'errors.greaterThan', limit: 10})
 *
 * NOTE: for single token use static toTranslate(), e.g.:
 * errors.address = ErrorList.toTranslate(validator.address(values.get('address')))
 */

// TODO @ipavlenko: It moved to platform folder as a temporary solution. You can move it to models after MINT-845 be fixed.
class ErrorList {
  constructor () {
    this.errors = []
  }

  getErrors () {
    const length = this.errors.length
    if (!length) {
      return null
    }
    return this.errors.map((item, index) => (
      <span key={item.value}>
        <Translate {...item} />
        {index !== length - 1 ? <span>, </span> : null }
      </span>
    ))
  }

  add (error) {
    if (error === null) {
      return this
    }
    if (typeof error === 'string') {
      // token only
      this.errors.push({
        value: error,
      })
    } else {
      // object with params
      this.errors.push(error)
    }
    return this
  }

  // used for single token
  static toTranslate (token) {
    const vars = typeof token === 'object' ? token : { value: token }
    return token ? <Translate {...vars} /> : null
  }
}

export default ErrorList
