import ERC20DAO from 'dao/ERC20DAO'
import EventEmitter from 'events'

export const EVENT_NEW_TOKEN = 'newToken'

class TokenService extends EventEmitter {
  constructor () {
    super(...arguments)
    this._cache = {}
  }

  getDAO (token) {
    return this._cache[ token.id() ]
  }

  createDAO (token) {
    // TODO @dkchv: unsubscribe if exists
    if (!token.isERC20()) {
      return
    }
    const dao = new ERC20DAO(token.address())
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
}

export default new TokenService()
