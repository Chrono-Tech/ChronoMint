import React from 'react'
import { Translate } from 'react-redux-i18n'
import AbstractNoticeModel from './AbstractNoticeModel'

class TransactionNoticeModel extends AbstractNoticeModel {
  message () {
    return <Translate value='notices.tx.processing' />
  }
}

export default TransactionNoticeModel
