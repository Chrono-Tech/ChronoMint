import React from 'react'
import { Map } from 'immutable'
import { Translate } from 'react-redux-i18n'
import { abstractModel } from './AbstractModel'
import moment from 'moment'

/** @see OperationModel.summary */
export const ARGS_TREATED = '__treated'

class TransactionExecModel extends abstractModel({
  id: null,
  contract: '',
  func: '',
  args: {},
  value: null,
  gas: null,
  gasUsed: null,
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

  gas () {
    return +this.get('gas')
  }

  value () {
    return +this.get('value')
  }

  costWithFee () {
    return this.value() + this.gas()
  }

  /**
   * @returns {string}
   * @private
   */
  _i18n () {
    return 'tx.' + this.get('contract') + '.'
  }

  i18nFunc () {
    return this._i18n() + this.funcName() + '.'
  }

  func () {
    return this.i18nFunc() + 'title'
  }

  description (withTime = true, style) { // TODO we don't need to override this, so probably it should be extracted in a component
    const args = this.args()
    let argsTreated = false
    if (args.hasOwnProperty(ARGS_TREATED)) {
      argsTreated = true
      delete args[ARGS_TREATED]
    }
    const list = new Map(Object.entries(args))
    return <div style={{margin: '15px 0', ...style}}>
      <Translate value={this.func()} /><br />
      {list.entrySeq().map(([key, value]) =>
        <span key={key}><Translate value={argsTreated ? key : this.i18nFunc() + key} />: <b>{value}</b><br /></span>)}
      {withTime ? <small>{this.time()}</small> : ''}
    </div>
  }

  historyBlock (additional, date) {
    return (
      <span>
        {additional}
        {this.description(false, {margin: 0, lineHeight: '25px'})}
        <small style={{display: 'block'}}>{date || this.time()}</small>
      </span>
    )
  }
}

export default TransactionExecModel
