import React from 'react'
import { Translate } from 'react-redux-i18n'
import { abstractNoticeModel } from './AbstractNoticeModel'
import TransactionExecModel from '../TransactionExecModel'
import { TxError } from '../../dao/AbstractContractDAO'

/**
 * TODO @bshevchenko: refactor layout of this model and do same for...
 * @see OperationNoticeModel
 */
class TransactionErrorNoticeModel extends abstractNoticeModel({
  tx: null,
  error: null
}) {
  constructor (tx: TransactionExecModel, error: TxError) {
    super({tx, error})
  }

  tx (): TransactionExecModel {
    return this.get('tx')
  }

  error (): TxError {
    return this.get('error')
  }

  /** @private */
  _error (): TxError {
    return <span><Translate value={'errorCodes.' + this.error().code}/><br />{this.error().message}</span>
  }

  message () {
    return <div>
      {this._error()}
      {this.tx().description(false, {margin: 0})}
    </div>
  }

  historyBlock () {
    return this.tx().historyBlock(this._error(), this.date())
  }

  fullHistoryBlock () {
    return (
      <div>
        {this._error()}
        {this.tx().description(false, {marginTop: '10px'})}
        <p style={{marginBottom: '0'}}>
          <small>{this.date()}</small>
        </p>
      </div>
    )
  }
}

export default TransactionErrorNoticeModel
