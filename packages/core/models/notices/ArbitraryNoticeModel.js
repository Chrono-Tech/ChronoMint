/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractNoticeModel } from './AbstractNoticeModel'

export default class ArbitraryNoticeModel extends abstractNoticeModel({
  key: null,
  params: {},
}) {
  message () {
    return {
      value: this.get('key'),
      ...this.get('params'),
    }
  }
}
