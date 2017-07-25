import React from 'react'
import type BigNumber from 'bignumber.js'
import type TokenModel from '../TokenModel'
import { I18n } from 'react-redux-i18n'
import { abstractNoticeModel } from './AbstractNoticeModel'

export default class ApprovalNoticeModel extends abstractNoticeModel({
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

  icon () {
    return (<i className='material-icons'>account_balance_wallet</i>)
  }

  title () {
    return I18n.t('notices.approval.title')
  }

  details () {
    return [
      { label: I18n.t('notices.approval.details.value'), value: `${this.value().toString(10)} ${this.token().symbol()}` },
      { label: I18n.t('notices.approval.details.contractName'), value: this.contractName() }
    ]
  }

  message () {
    return I18n.t('notices.approval.message', {
      value: this.value().toString(10),
      symbol: this.token().symbol(),
      contractName: this.contractName()
    })
  }
}
