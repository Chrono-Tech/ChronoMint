import React from 'react'
import { Translate } from 'react-redux-i18n'
import { abstractNoticeModel } from './AbstractNoticeModel'
import OperationModel from '../OperationModel'

/**
 * TODO @bshevchenko: refactor layout of this model and do same for...
 * @see TransactionErrorNoticeModel
 */
class OperationNoticeModel extends abstractNoticeModel({
  operation: null,
  isRevoked: false
}) {
  /** @returns {OperationModel} */
  operation () {
    return this.get('operation')
  }

  isRevoked () {
    return this.get('isRevoked')
  }

  _status () {
    let v = 'confirmed'
    if (this.operation().isCancelled()) {
      v = 'cancelled'
    } else if (this.operation().isDone()) {
      v = 'done'
    } else if (this.isRevoked()) {
      v = 'revoked'
    }
    return <Translate value={'notices.operations.' + v} remained={this.operation().remained()} />
  }

  message () {
    return <div>
      {this._status()}
      {this.operation().tx().description(false, {margin: 0})}
    </div>
  }

  historyBlock () {
    return this.operation().tx().historyBlock(this._status(), this.date())
  }

  fullHistoryBlock () {
    return (
      <div>
        {this._status()}
        {this.operation().tx().description(false, {marginTop: '10px'})}
        <p style={{marginBottom: '0'}}>
          <small>{this.date()}</small>
        </p>
      </div>
    )
  }
}

export default OperationNoticeModel
