/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import ChronoBankPlatformDAO from '../dao/ChronoBankPlatformDAO'

class AssetsManagerService extends EventEmitter {

  constructor () {
    super(...arguments)
    this._cache = {}
  }

  getChronoBankPlatformDAO (address, web3, history) {
    if (!this._cache[address]) {
      const platformDAO = new ChronoBankPlatformDAO(address, history)
      platformDAO.connect(web3)
      platformDAO.setVotingManagerDAO(this.getVotingManager())
      this._cache[address] = platformDAO
    }
    return this._cache[address]

  }
}

export default new AssetsManagerService()
