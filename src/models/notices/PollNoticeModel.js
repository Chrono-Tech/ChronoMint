import { I18n, ImageProvider } from 'platform'
import type PollDetailsModel from 'models/PollDetailsModel'
import { abstractNoticeModel } from './AbstractNoticeModel'

export const IS_CREATED = 'isCreated'
export const IS_ACTIVATED = 'isActivated'
export const IS_ENDED = 'isEnded'
export const IS_UPDATED = 'isUpdated'
export const IS_REMOVED = 'isRemoved'
export const IS_VOTED = 'isVoted'

export default class PollNoticeModel extends abstractNoticeModel({
  pollId: null,
  poll: null,
  status: null,
  transactionHash: null,
}) {
  icon () {
    return ImageProvider.getImage('PollNoticeModel')
  }

  title () {
    return I18n.t('notices.polls.title')
  }

  status () {
    return this.get('status')
  }

  transactionHash (hash) {
    if (hash !== undefined) {
      return this.set('transactionHash', hash)
    }
    return this.get('transactionHash')
  }

  pollId () {
    return this.get('pollId')
  }

  poll (): PollDetailsModel {
    return this.get('poll')
  }

  message () {
    const message = `notices.polls.${this.get('status')}`
    return I18n.t(message)
  }
}
