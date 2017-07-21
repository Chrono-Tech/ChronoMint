import { I18n } from 'react-redux-i18n'
import { abstractNoticeModel } from './AbstractNoticeModel'
import type OperationModel from '../OperationModel'

const CONFIRMED = 'notices.locs.added'
const CANCELLED = 'notices.locs.removed'
const REVOKED = 'notices.locs.statusUpdated'
const DONE = 'notices.locs.updated'

export const statuses = {
  CONFIRMED,
  CANCELLED,
  REVOKED,
  DONE
}

export default class OperationNoticeModel extends abstractNoticeModel({
  operation: null,
  isRevoked: false
}) {
  operation (): OperationModel {
    return this.get('operation')
  }

  isRevoked () {
    return this.get('isRevoked')
  }

  _status () {
    if (this.operation().isCancelled()) {
      return CANCELLED
    } else if (this.operation().isDone()) {
      return DONE
    } else if (this.isRevoked()) {
      return REVOKED
    }
    return CONFIRMED
  }

  message () {
    return I18n.t(this._status(), {
      remained: this.operation().remained()
      // TODO @ipavlenko: Also display operation
      // operation: this.operation().tx().description(false, {margin: 0})}
    })
  }

  // historyBlock () {
  //   return this.operation().tx().historyBlock(this._status(), this.date())
  // }

  // fullHistoryBlock () {
  //   return (
  //     <div>
  //       {this._status()}
  //       {this.operation().tx().description(false, {marginTop: '10px'})}
  //       <p style={{marginBottom: '0'}}>
  //         <small>{this.date()}</small>
  //       </p>
  //     </div>
  //   )
  // }
}
