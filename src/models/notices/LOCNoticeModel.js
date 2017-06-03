import React from 'react'
import { abstractNoticeModel } from './AbstractNoticeModel'
import { Translate, I18n } from 'react-redux-i18n'

export const ADDED = 'locs.notice.added'
export const REMOVED = 'locs.notice.removed'
export const UPDATED = 'locs.notice.updated'

class LOCNoticeModel extends abstractNoticeModel({
  action: null,
  name: null
}) {
  message () {
    return <Translate
      value='locs.notice.message'
      name={this.get('name')}
      action={I18n.t(this.get('action'))}
    />
  }
}

export default LOCNoticeModel
