import { I18n } from 'react-redux-i18n'
import React from 'react'
import { abstractNoticeModel } from './AbstractNoticeModel'

const CREATED = 'notices.wallet.created'
// const ADDED = 'notices.locs.added'
// const REMOVED = 'notices.locs.removed'
// const UPDATED = 'notices.locs.updated'
// const ISSUED = 'notices.locs.issued'
// const REVOKED = 'notices.locs.revoked'
// const FAILED = 'notices.locs.failed'

export const statuses = {
  CREATED,
  // ADDED,
  // REMOVED,
  // UPDATED,
  // ISSUED,
  // REVOKED,
  // FAILED
}

export default class WalletNoticeModel extends abstractNoticeModel({
  action: null,
  name: null,
  amount: null,
}) {

  icon () {
    return (<i className='material-icons'>group</i>)
  }

  title () {
    return I18n.t('notices.locs.title')
  }

  // noinspection JSUnusedGlobalSymbols
  details () {
    const amount = this.get('amount')
    return amount
      ? [
        { label: I18n.t('notices.locs.details.amount'), value: `${amount}` },
      ]
      : null
  }

  message () {
    return I18n.t(this.get('action'), {
      name: this.get('name'),
    })
  }
}
