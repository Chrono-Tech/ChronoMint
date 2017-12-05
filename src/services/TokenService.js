import contractsManagerDAO from 'dao/ContractsManagerDAO'
import ERC20ManagerDAO, { EVENT_NEW_ERC20_TOKEN } from 'dao/ERC20ManagerDAO'
import EventEmitter from 'events'
import type TokenModel from 'models/TokenModel'

export const EVENT_NEW_TOKEN = 'newToken'

class TokenService extends EventEmitter {
  constructor () {
    super(...arguments)
    this._cache = {}
  }

  async init () {
    const erc20: ERC20ManagerDAO = await contractsManagerDAO.getERC20ManagerDAO()
    erc20.on(EVENT_NEW_ERC20_TOKEN, (token: TokenModel) => this.emit(EVENT_NEW_TOKEN, token))
  }

  getDAO (address) {

  }

  createDAO (address) {

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
