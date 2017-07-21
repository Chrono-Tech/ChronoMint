import React from 'react'
import { I18n } from 'react-redux-i18n'
import Immutable from 'immutable'
import BigNumber from 'bignumber.js'
import { Translate } from 'react-redux-i18n'
import moment from 'moment'
import { abstractModel } from './AbstractModel'

/** @see OperationModel.summary */
export const ARGS_TREATED = '__treated'

class TxExecModel extends abstractModel({
  id: null,
  contract: '',
  func: '',
  args: {},
  value: new BigNumber(0),
  gas: new BigNumber(0),
  isGasUsed: null,
  estimateGasLaxity: null,
  hash: null,
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

  // TODO @bshevchenko: why this method is unused?
  //noinspection JSUnusedGlobalSymbols
  argsWithoutTreated () {
    const args = this.args()
    if (args.hasOwnProperty(ARGS_TREATED)) {
      delete args[ARGS_TREATED]
    }
    return args
  }

  gas (): BigNumber {
    return this.get('gas')
  }

  setGas (v: BigNumber, isGasUsed = false): TxExecModel {
    return this.set('gas', v)
      .set('isGasUsed', isGasUsed)
      .set('estimateGasLaxity', isGasUsed ? this.gas().minus(v) : null)
  }

  isGasUsed () {
    return this.get('isGasUsed')
  }

  estimateGasLaxity (): BigNumber {
    return this.get('estimateGasLaxity')
  }

  value (): BigNumber {
    return this.get('value')
  }

  hash () {
    return this.get('hash')
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

  title () {
    return I18n.t(this.func())
  }

  // TODO @bshevchenko: refactor this using new design markup
  // TODO @bshevchenko: display BigNumber using TokenValue
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
        <span key={key}><Translate value={argsTreated ? key : this.i18nFunc() + key} />:&nbsp;
          <b>{typeof value === 'object' &&
          value.constructor.name === 'BigNumber' ? value.toString(10) : value}</b><br /></span>)}
      {withTime ? <small>{this.time()}</small> : ''}
    </div>
  }

  // historyBlock (additional, date) {
  //   return (
  //     <span>
  //       {additional}
  //       {this.description(false, {margin: 0, lineHeight: '25px'})}
  //       <small style={{display: 'block'}}>{date || this.time()}</small>
  //     </span>
  //   )
  // }
}

export default TxExecModel
