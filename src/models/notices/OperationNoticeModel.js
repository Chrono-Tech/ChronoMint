/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { I18n } from 'platform/i18n'
import { Icons } from 'platform/icons'
import { abstractNoticeModel } from './AbstractNoticeModel'
import type OperationModel from '../OperationModel'
import type TxExecModel from '../TxExecModel'

const CONFIRMED = 'notices.operations.confirmed'
const CANCELLED = 'notices.operations.cancelled'
const REVOKED = 'notices.operations.revoked'
const DONE = 'notices.operations.done'

export default class OperationNoticeModel extends abstractNoticeModel({
  operation: null,
  isRevoked: false,
}) {
  operation (): OperationModel {
    return this.get('operation')
  }

  isRevoked () {
    return this.get('isRevoked')
  }

  icon () {
    return Icons.get('notices.operations.icon')
  }

  title () {
    return I18n.t('notices.operations.title')
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
      remained: this.operation().remained(),
    })
  }

  tx (): TxExecModel {
    return this.operation().tx()
  }

  // TODO @bshevchenko: remove noinspection
  // noinspection JSUnusedGlobalSymbols
  details () {
    const details = [
      { label: I18n.t('notices.operations.details.operation'), value: I18n.t(this.tx().func()) },
      ...this.tx().details(),
    ]
    const hash = this.tx().hash()
    if (hash) {
      details.push({
        label: I18n.t('notices.operations.details.hash'),
        value: hash,
      })
    }
    return details
  }
}
