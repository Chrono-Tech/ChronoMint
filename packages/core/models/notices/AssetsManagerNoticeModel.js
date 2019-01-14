/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractNoticeModel } from './AbstractNoticeModel'

export const MANAGER_ADDED = 'managerAdded'
export const MANAGER_REMOVED = 'managerRemoved'

export const ASSET_PAUSED = 'assetPaused'
export const ASSET_UNPAUSED = 'assetUnpaused'

export const USER_ADDED_TO_BLACKLIST = 'userAddedToBlacklist'
export const USER_DELETED_FROM_BLACKLIST = 'userDeletedFromBlacklist'

export default class AssetsManagerNoticeModel extends abstractNoticeModel({
  status: null,
  transactionHash: null,
  replacements: {},
}) {
  icon () {
    return 'notices.transfer.icon'
  }

  title () {
    return 'notices.assetsManager.title'
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

  message () {
    return {
      value: `notices.assetsManager.${this.get('status')}`,
      ...this.get('replacements'),
    }
  }
}
