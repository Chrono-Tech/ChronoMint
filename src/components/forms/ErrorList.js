import React from 'react'
import { Translate } from 'react-redux-i18n'

// Helper class for convert list of errors tokens to string using <Translate> comp
// You cam add params to errors tokens, example:
// someErrors.add({ value: 'errors.greaterThan', limit: 10})

// NOTE: for single token use static toTranslate(), e.g.:
// errors.address = ErrorList.toTranslate(validator.address(values.get('address')))
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

  getLength () {
    return this.errors.length
  }

  // used for single token
  static toTranslate (token) {
    return token ? <Translate value={token} /> : null
  }
}

export default ErrorList
