import React from 'react'
import type PollModel from 'models/PollModel'
import { I18n } from 'react-redux-i18n'
import { abstractNoticeModel } from './AbstractNoticeModel'

export const IS_CREATED = 'isCreated'
export const IS_UPDATED = 'isUpdated'
export const IS_REMOVED = 'isRemoved'

export default class PollNoticeModel extends abstractNoticeModel({
  poll: null,
  status: null
}) {
  constructor (poll: PollModel, status: string) {
    super({
      poll,
      status
    })
  }

  icon () {
    return (<i className='material-icons'>poll</i>)
  }

  title () {
    return I18n.t('notices.polls.title')
  }

  status () {
    return this.get('status')
  }

  poll (): PollModel {
    return this.get('poll')
  }

  message () {
    const message = 'notices.polls.' + this.get('status')
    return I18n.t(message)
  }
}
