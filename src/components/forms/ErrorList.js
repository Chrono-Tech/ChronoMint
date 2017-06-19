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
class ErrorList {
  constructor () {
    this.errors = []
  }

  getErrors () {
    const length = this.errors.length
    if (!length) {
      return null
    }
    return this.errors.map((item, index) => {
      return (
        <span key={item.value}>
          <Translate {...item} />
          {index !== length - 1 ? <span>, </span> : null }
        </span>
      )
    })
  }

  add (error) {
    if (error === null) {
      return
    }
    if (typeof error === 'string') {
      // token only
      this.errors.push({
        value: error
      })
    } else {
      // object with params
      this.errors.push(error)
    }
  }

  // used for single token
  static toTranslate (token) {
    const vars = typeof token === 'object' ? token : {value: token}
    return token ? <Translate {...vars} /> : null
  }
}

export default ErrorList
