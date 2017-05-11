import React from 'react'
import { Map } from 'immutable'
import { Translate } from 'react-redux-i18n'
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

  funcName () {
    return this.get('func')
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
    return this._i18n() + this.funcName() + '.'
  }

  func () {
    return this._i18nFunc() + 'title'
  }

  args () {
    return this.get('args')
  }

  /**
   * @returns {Immutable.Map}
   * @private
   */
  _args () {
    return new Map(Object.entries(this.args()))
  }

  description () { // TODO we don't need to override this, so probably it should be extracted in a component
    return <div>
      <Translate value={this.func()} /><br />
      {this._args().entrySeq().map(([i, v]) =>
        <span key={i}><Translate value={this._i18nFunc() + i} />: <b>{v}</b><br /></span>)}
    </div>
  }
}

export default TransactionExecModel
