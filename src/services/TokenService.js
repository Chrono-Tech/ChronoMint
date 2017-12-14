import ERC20DAO from 'dao/ERC20DAO'
import EventEmitter from 'events'
import TokenModel from 'models/TokenModel'

export const EVENT_NEW_TOKEN = 'newToken'
export const EVENT_TOKENS_FETCHED = 'tokensFetched'

class TokenService extends EventEmitter {
  constructor () {
    super(...arguments)
    this._cache = {}
  }

  getDAO (token: TokenModel | string) {
    return this._cache[ token.id ? token.id() : token ]
  }

  createDAO (token) {
    // TODO @dkchv: unsubscribe if exists
    if (!token.isERC20()) {
      return
    }
    const dao = new ERC20DAO(token)
    this._cache [ token.id() ] = dao
    this.emit(EVENT_NEW_TOKEN, token, dao)
  }

  registerDAO (token, dao) {
    this._cache [ token.id() ] = dao
    this.emit(EVENT_NEW_TOKEN, token, dao)
  }

  subscribeToDAO (model) {

  }

  unsubcribe (address) {

  }

  unsubscribeAll () {

  }

  // shortcuts
  getTimeDAO () {

  }

  getBitcoinDAO () {

  }

  tokensFetched () {
    this.emit(EVENT_TOKENS_FETCHED)
  }
}

export default new TokenService()
