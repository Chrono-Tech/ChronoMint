import React from 'react'
import { Map } from 'immutable'
import { Translate } from 'react-redux-i18n'
import { abstractModel } from './AbstractModel'
import moment from 'moment'

class TransactionExecModel extends abstractModel({
  id: null,
  contract: '',
  func: '',
  args: {},
  value: null,
  gas: null,
  time: Date.now()
}) {
  constructor (data) {
    super({
      id: Math.random(),
      ...data
    })
  }

  id () {
    return this.get('id')
  }

  time () {
    return moment(this.get('time')).format('Do MMMM YYYY HH:mm:ss')
  }

  contract () {
    return this.get('contract')
  }

  funcName () {
    return this.get('func')
  }

  args () {
    return this.get('args')
  }

  /**
   * @returns {string}
   * @private
   */
  _i18n () {
    return 'tx.' + this.get('contract') + '.'
  }

  /**
   * @returns {string}
   * @private
   */
  _i18nFunc () {
    return this._i18n() + this.funcName() + '.'
  }

  func () {
    return this._i18nFunc() + 'title'
  }

  /**
   * @returns {Immutable.Map}
   * @private
   */
  _args () {
    return new Map(Object.entries(this.args()))
  }

  description () { // TODO we don't need to override this, so probably it should be extracted in a component
    return <div style={{margin: '15px 0'}}>
      <Translate value={this.func()} /><br />
      {this._args().entrySeq().map(([i, v]) =>
        <span key={i}><Translate value={this._i18nFunc() + i} />: <b>{v}</b><br /></span>)}
      <small>{this.time()}</small>
    </div>
  }
}

export default TransactionExecModel
