/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import TokenModel from '../models/tokens/TokenModel'
import ERC20TokenDAO from '../dao/ERC20TokenDAO'

import {
  EVENT_NEW_TOKEN,
} from '../dao/constants'

class TokenService extends EventEmitter {
  constructor () {
    super(...arguments)
    this._cache = {}
  }

  getDAO (token: TokenModel | string) {
    return this._cache[token instanceof TokenModel ? token.id() : token]
  }

  createDAO (token, web3) {
    // TODO @dkchv: unsubscribe if exists
    if (!token.isERC20()) {
      return
    }
    const dao = new ERC20TokenDAO(token)
    dao.connect(web3)
    this._cache [token.id()] = dao
    this.emit(EVENT_NEW_TOKEN, token, dao)
    return dao
  }

  // TODO @ipavlenko: TokenService should not handle state, redux should. Move DAOs collection to redux
  registerDAO (token, dao) {
    this._cache [token.id()] = dao
    this.emit(EVENT_NEW_TOKEN, token, dao)
  }
}

export default new TokenService()
