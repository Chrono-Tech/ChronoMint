import React from 'react'
import type CBEModel from '../CBEModel'
import { I18n } from 'react-redux-i18n'
import { abstractNoticeModel } from './AbstractNoticeModel'

export default class CBENoticeModel extends abstractNoticeModel({
  cbe: null,
  isRevoked: false
}) {
  cbe (): CBEModel {
    return this.get('cbe')
  }

  icon () {
    return (<i className='material-icons'>settings</i>)
  }

  isRevoked () {
    return this.get('isRevoked')
  }

  message () {
    return this.isRevoked()
      ? I18n.t('notices.cbe.removed', { address: this.cbe().address() })
      : I18n.t('notices.cbe.added', { address: this.cbe().address() })
  }
}
