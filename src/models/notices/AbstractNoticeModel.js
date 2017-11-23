import { I18n, ImageProvider } from 'platform'
import moment from 'moment'
import uniqid from 'uniqid'
import { abstractModel } from '../AbstractModel'

// noinspection JSUnusedLocalSymbols
export const abstractNoticeModel = (defaultValues) => class AbstractNoticeModel extends abstractModel({ ...defaultValues }) {
  // neither id or time is a default record value
  constructor (data) {
    super({
      id: uniqid(),
      timestamp: Date.now(),
      ...data,
    })
  }

  title () {
    return I18n.t('notices.arbitrary.title')
  }

  address () {
    // Override if suitable
    return null
  }

  // noinspection JSUnusedGlobalSymbols
  subject () {
    // Override if suitable
    return null
  }

  message () {
    throw new Error('should be overridden')
  }

  details () {
    // Array[{ label, value }] with props related to notice
    return null
  }

  icon () {
    return ImageProvider.getImage('AbstractNoticeModel')
  }

  time () {
    return this.get('timestamp')
  }

  date () {
    const time = this.time() / 1000
    return time && moment.unix(time) || null
  }
}

export default abstractNoticeModel()
