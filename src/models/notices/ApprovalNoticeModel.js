import type BigNumber from 'bignumber.js'
import { I18n, ImageProvider } from 'platform'
import { abstractNoticeModel } from './AbstractNoticeModel'
import type TokenModel from '../TokenModel'

export default class ApprovalNoticeModel extends abstractNoticeModel({
  token: null,
  value: null,
  spender: null,
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

  icon () {
    return ImageProvider.getImage(ApprovalNoticeModel)
  }

  title () {
    return I18n.t('notices.approval.title')
  }

  message () {
    return I18n.t('notices.approval.message', {
      value: this.value().toString(10),
      symbol: this.token().symbol(),
      contractName: this.contractName(),
    })
  }
}
