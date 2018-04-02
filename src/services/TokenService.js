import ERC20DAO from 'dao/ERC20DAO'
import EventEmitter from 'events'
import TokenModel from 'models/tokens/TokenModel'

export const EVENT_NEW_TOKEN = 'newToken'
export const EVENT_TOKENS_FETCHED = 'tokensFetched'

class TokenService extends EventEmitter {
  constructor () {
    super(...arguments)
    this._cache = {}
  }

  getDAO (token: TokenModel | string) {
    return this._cache[ token instanceof TokenModel ? token.id() : token ]
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

  // TODO @ipavlenko: TokenService should not handle state, redux should. Move DAOs collection to redux
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
}

export default new TokenService()
