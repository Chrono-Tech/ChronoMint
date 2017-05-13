import React from 'react'
import { Translate } from 'react-redux-i18n'

class ErrorList {
  constructor () {
    this.errors = []
  }

  getErrors () {
    const length = this.errors.length
    if (!length) {
      return undefined
    }
    return this.errors.map((item, index) => (
      <span key={item}>
        <Translate value={item}/>
        {index !== length - 1 ? <span>, </span> : null }
      </span>
    ))
  }

  add (e) {
    if (e === null) {
      return
    }
    this.errors.push(e)
  }
}

export default ErrorList
