/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractNoticeModel } from './AbstractNoticeModel'
import type CBEModel from '../CBEModel'

export default class CBENoticeModel extends abstractNoticeModel({
  cbe: null,
  isRevoked: false,
}) {
  cbe (): CBEModel {
    return this.get('cbe')
  }

  icon () {
    return 'notices.settings.icon'
  }

  title () {
    return 'notices.settings.title'
  }

  isRevoked () {
    return this.get('isRevoked')
  }

  message () {
    return this.isRevoked()
      ? {
        value: 'notices.cbe.removed',
        address: this.cbe().address(),
      }
      : {
        value: 'notices.cbe.added',
        address: this.cbe().address(),
      }
  }
}
