/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { I18n } from 'platform/i18n'
import { Icons } from 'platform/icons'
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
  address: null,
}) {

  icon () {
    return Icons.get('notices.wallet.icon')
  }

  title () {
    return I18n.t('notices.wallet.title')
  }

  // noinspection JSUnusedGlobalSymbols
  details () {
    return null
  }

  message () {
    return I18n.t(this.get('action'), {
      address: this.get('address'),
    })
  }
}
