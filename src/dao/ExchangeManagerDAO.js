import Immutable from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import ExchangeDAO from './ExchangeDAO'
import ExchangeModel from 'models/ExchangeModel'
import type TokenModel from 'models/TokenModel'

export const TX_ADD_OWNER = 'addExchangeOwner'
export const TX_REMOVE_OWNER = 'removeExchangeOwner'
export const TX_CREATE = 'createExchange'
export const TX_REMOVE = 'removeExchange'
export const TX_EDIT = 'editExchange'
export const TX_ADD = 'addExchange'
export const TX_FORWARD = 'forward'

export default class ExchangeManagerDAO extends AbstractContractDAO {

  constructor (at = null) {
    super(
      require('chronobank-smart-contracts/build/contracts/ExchangeManager.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  /**
   * Returns map associated with symbols, which contains map of ExchangeModel associated with Exchange contract address.
   */
  async getList (): Promise<Immutable.Map<ExchangeModel>> {

    const addresses = await this._call('getExchangesForOwner', [this.getAccount()])

    // get symbols
    const models: Array<ExchangeModel> = []
    const promises = []
    for (let at of addresses) {
      const dao = new ExchangeDAO(at)
      models.push(new ExchangeModel({dao}))
      promises.push(dao.getAssetSymbol())
    }
    const symbols = await Promise.all(promises)

    let i = 0
    let map = new Immutable.Map()
    for (let model of models) {
      map.set(model.address(), model.setSymbol(symbols[i]))
      i++
    }

    return map
  }

  /**
   * TODO @bshevchenko: This is only for demo LHT auto-exchangers
   */
  async getDemoExchange (): Promise<ExchangeDAO> {
    return new ExchangeDAO(await this._call('exchanges', [0]))
  }

  async addExchange (address) {
    return this._tx(TX_ADD, [address])
  }

  async createExchange (token: TokenModel) {
    return this._tx(TX_CREATE, [
      token.symbol(),
      false // TODO @bshevchenko: use ticker flag
    ])
  }

  async editExchange (exchange: ExchangeModel, newExchange: ExchangeModel) {
    return this._tx(TX_EDIT, [exchange.address(), newExchange.address()])
  }

  async removeExchange (exchange: ExchangeModel) {
    return this._tx(TX_REMOVE, [exchange.address()])
  }

  // TODO @bshevchenko: MINT-230 AssetsManager
  // noinspection JSUnusedGlobalSymbols
  async addOwner (exchange: ExchangeModel, account) {
    return this._tx(TX_ADD_OWNER, [exchange.address(), account])
  }

  // TODO @bshevchenko: MINT-230 AssetsManager
  // noinspection JSUnusedGlobalSymbols
  async removeOwner (exchange: ExchangeModel, account) {
    return this._tx(TX_REMOVE_OWNER, [exchange.address(), account])
  }

  /**
   * @see ExchangeDAO
   */
  async forward (exchangeAddress, data, infoArgs) {
    return this._tx(TX_FORWARD, [exchangeAddress, data], infoArgs)
  }
}
