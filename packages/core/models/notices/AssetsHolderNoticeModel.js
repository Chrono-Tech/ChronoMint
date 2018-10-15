/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractNoticeModel } from './AbstractNoticeModel'

export default class AssetsHolderNoticeModel extends abstractNoticeModel({
  icon: null,
  title: null,
  value: '',
  params: {},
}) {
  icon () {
    return this.get('icon') ? 'assetsHolder.' + this.get('icon') : 'notices.transfer.icon'
  }

  title () {
    return this.get('title') ? 'assetsHolder.' + this.get('title') : 'notices.transfer.icon'
  }

  message () {
    return {
      value: 'assetsHolder.' + this.get('value'),
      ...this.get('params'),
    }
  }
}
