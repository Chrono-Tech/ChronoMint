import { I18n, ImageProvider } from 'platform'
import type TokenModel from 'models/TokenModel'
import { abstractNoticeModel } from './AbstractNoticeModel'

export const IS_ADDED = 'isAdded'
export const IS_MODIFIED = 'isModified'
export const IS_REMOVED = 'isRemoved'

export default class TokenNoticeModel extends abstractNoticeModel({
  token: null,
  status: null,
  oldAddress: null,
}) {
  constructor (token: TokenModel, time, isRemoved = false, isAdded = true, oldAddress = null) {
    super({
      token,
      time,
      status: isRemoved ? IS_REMOVED : (isAdded ? IS_ADDED : IS_MODIFIED),
      oldAddress,
    })
  }

  icon () {
    return ImageProvider.getImage('TokenNoticeModel')
  }

  title () {
    return I18n.t('notices.settings.title')
  }

  token (): TokenModel {
    return this.get('token')
  }

  // for modify status
  oldAddress (): string {
    return this.get('oldAddress')
  }

  isModified () {
    return this.get('status') === IS_MODIFIED
  }

  isRemoved () {
    return this.get('status') === IS_REMOVED
  }

  message () {
    const message = `notices.settings.erc20.tokens.${this.get('status')}`
    return I18n.t(message, {
      symbol: this.token().symbol(),
      name: this.token().name(),
    })
  }
}
