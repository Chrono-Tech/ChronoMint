/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { I18n } from '@chronobank/core-dependencies/i18n'
import { abstractNoticeModel } from './AbstractNoticeModel'

export default class ArbitraryNoticeModel extends abstractNoticeModel({
  key: null,
  params: {},
}) {
  message () {
    return I18n.t(this.get('key'), this.get('params'))
  }
}
