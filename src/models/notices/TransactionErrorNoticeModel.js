import type TxExecModel from '../TxExecModel'
import { TxError } from '../../dao/AbstractContractDAO'

import { I18n } from 'react-redux-i18n'
import { abstractNoticeModel } from './AbstractNoticeModel'

export default class TransactionErrorNoticeModel extends abstractNoticeModel({
  tx: null,
  error: null
}) {
  constructor (tx: TxExecModel, error: TxError) {
    super({tx, error})
  }

  tx (): TxExecModel {
    return this.get('tx')
  }

  error (): TxError {
    return this.get('error')
  }

  /** @private */
  // _error () {
  //   return <span><Translate value={'errorCodes.' + this.error().code}/><br />{this.error().message}</span>
  // }

  message () {
    const message = 'errorCodes.' + this.error().code
    return I18n.t(message)
    // return <div>
    //   {this._error()}
    //   {this.tx().description(false, {margin: 0})}
    // </div>
  }

  // historyBlock () {
  //   return this.tx().historyBlock(this._error(), this.date())
  // }

  // fullHistoryBlock () {
  //   return (
  //     <div>
  //       {this._error()}
  //       {this.tx().description(false, {marginTop: '10px'})}
  //       <p style={{marginBottom: '0'}}>
  //         <small>{this.date()}</small>
  //       </p>
  //     </div>
  //   )
  // }
}
