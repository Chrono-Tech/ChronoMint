import React from 'react'
import { Translate } from 'react-redux-i18n'
import AbstractNoticeModel from './AbstractNoticeModel'

class TransactionStartNoticeModel extends AbstractNoticeModel {
  message () {
    return <Translate value='notices.tx.processing' />
  }
}

export default TransactionStartNoticeModel
