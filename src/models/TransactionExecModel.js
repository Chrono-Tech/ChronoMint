import React from 'react'
import { abstractModel } from './AbstractModel'
import moment from 'moment'

class TransactionExecModel extends abstractModel({
  id: Math.random(),
  contract: '',
  func: '',
  args: {},
  value: null,
  gas: null,
  time: Date.now()
}) {
  id () {
    return this.get('id')
  }

  time () {
    return moment.unix(this.get('time')).format('Do MMMM YYYY HH:mm:ss')
  }

  /**
   * @return {string}
   * @private
   */
  _i18n () {
    return 'tx.' + this.get('contract') + '.'
  }

  /**
   * @return {string}
   * @private
   */
  _i18nFunc () {
    return this._i18n() + this.get('func') + '.'
  }

  func () {
    return this._i18nFunc() + 'title'
  }

  args () {
    let a: Object = this.get('args')
    const b = {}
    for (let key in (typeof a === 'object' && typeof a['summary'] === 'function' ? a.summary() : a)) {
      if (a.hasOwnProperty(key)) {
        b[this._i18nFunc() + key] = a[key]
      }
    }
    return b
  }

  description () { // TODO
    return <div>
      <b>{this.func()}</b>
      <p>{JSON.stringify(this.args())}</p>
    </div>
  }
}

export default TransactionExecModel
