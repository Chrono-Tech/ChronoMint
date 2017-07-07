import React from 'react'
import { Translate } from 'react-redux-i18n'
import AbstractNoticeModel from './AbstractNoticeModel'

class ArbitraryNoticeModel extends AbstractNoticeModel {
  constructor (i18nKey) {
    super()
    this._i18nKey = i18nKey
  }

  message () {
    return <Translate value={this._i18nKey} />
  }
}

export default ArbitraryNoticeModel
