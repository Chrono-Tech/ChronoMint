/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { I18n } from '@chronobank/core-dependencies/i18n'
import { Icons } from '@chronobank/core-dependencies/icons'

import type CBEModel from '../CBEModel'
import { abstractNoticeModel } from './AbstractNoticeModel'

export default class CBENoticeModel extends abstractNoticeModel({
  cbe: null,
  isRevoked: false,
}) {
  cbe (): CBEModel {
    return this.get('cbe')
  }

  icon () {
    return Icons.get('notices.settings.icon')
  }

  title () {
    return I18n.t('notices.settings.title')
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
