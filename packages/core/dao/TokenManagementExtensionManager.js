/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import TokenManagementExtensionDAO from './TokenManagementExtensionDAO'
import { TokenManagementInterfaceABI } from './abi'

export default class TokenManagementExtensionManager extends EventEmitter {
  constructor ({ web3, history }) {
    super()
    this.history = history
    this.web3 = web3
  }

  /**
   *
   * @param address
   * @returns {Promise<TokenManagementExtensionDAO>}
   */
  async getTokenManagementExtensionDAO (address: String) {
    const tokenManagementExtensionDao = new TokenManagementExtensionDAO({ abi: TokenManagementInterfaceABI, address, history: this.history })
    tokenManagementExtensionDao.connect(this.web3)

    return tokenManagementExtensionDao
  }
}
