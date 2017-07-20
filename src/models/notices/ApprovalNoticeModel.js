import type BigNumber from 'bignumber.js'
import type TokenModel from '../TokenModel'
import { abstractNoticeModel } from './AbstractNoticeModel'

class ApprovalNoticeModel extends abstractNoticeModel({
  token: null,
  value: null,
  spender: null
}) {
  token (): TokenModel {
    return this.get('token')
  }
  
  value (): BigNumber {
    return this.get('value')
  }

  spender (): string {
    return this.get('spender')
  }
  
  setToken (token: TokenModel): ApprovalNoticeModel {
    return this.set('token', token)
  }

  /**  @param names key (contract account) – value (name) pairs */
  static setContractNames (names: Object) {
    ApprovalNoticeModel._contractNames = names
  }
  
  contractName (): string {
    const names = ApprovalNoticeModel._contractNames
    if (names && names.hasOwnProperty(this.spender())) {
      return names[this.spender()]
    }
    return this.spender()
  }

  message () {
    return this.value().toString(10) + ' ' + this.token().symbol() +
      ' approved to transfer for ' + this.contractName()
  }
}

export default ApprovalNoticeModel
