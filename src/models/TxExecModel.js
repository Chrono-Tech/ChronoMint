import React from 'react'
import Immutable from 'immutable'
import { Translate } from 'react-redux-i18n'
import moment from 'moment'
import { abstractModel } from './AbstractModel'
import TxPluralModel from './TxPluralModel'

/** @see OperationModel.summary */
export const ARGS_TREATED = '__treated'

class TxExecModel extends abstractModel({
  id: null,
  contract: '',
  func: '',
  args: {},
  value: null,
  gas: null,
  hash: null,
  plural: null,
  time: Date.now()
}) {
  constructor (data) {
    super({
      id: (data && data['id']) || Math.random(),
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
    return this.get('args') || {}
  }

  argsWithoutTreated () {
    const args = this.args()
    if (args.hasOwnProperty(ARGS_TREATED)) {
      delete args[ARGS_TREATED]
    }
    return args
  }

  gas () {
    return +this.get('gas')
  }

  setGas (v): TxExecModel {
    return this.set('gas', v)
  }

  value () {
    return +this.get('value')
  }

  hash () {
    return this.get('hash')
  }

  plural(): ?TxPluralModel {
    return this.get('plural')
  }

  setPlural (plural: TxPluralModel): TxExecModel {
    return this.set('plural', plural)
  }

  isPlural () {
    return this.plural() && this.plural().totalSteps() > 0
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

  // TODO @bshevchenko: refactor this using new design markup
  description (withTime = true, style) {
    const args = this.args()
    let argsTreated = false
    if (args.hasOwnProperty(ARGS_TREATED)) {
      argsTreated = true
      delete args[ARGS_TREATED]
    }
    const list = new Immutable.Map(Object.entries(args))
    return <div style={{margin: '15px 0', ...style}}>
      <Translate value={this.func()} /><br />
      {this.hash() ? <span>{this.hash()}<br /></span> : ''}
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

export default TxExecModel
