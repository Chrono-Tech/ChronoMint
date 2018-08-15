/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import tokenService from './TokenService'
import TokenModel from '../models/tokens/TokenModel'
import ExchangeManagerDAO from '../dao/ExchangeManagerDAO'
import { ExchangeDAO } from '../dao/ExchangeDAO'
import { EVENT_NEW_TRANSFER } from '../dao/constants'
import TxModel from '../models/TxModel'

class ExchangeService extends EventEmitter {

  constructor () {
    super(...arguments)
    this._cache = {}
  }

  getExchangeManagerDAO (address) {
    if (!this._cache[ address ]) {
      this._cache[ address ] = new ExchangeManagerDAO(address)
    }
    return this._cache[ address ]
  }

  getExchangeDAO (address) {
    this._cache[ address ] = new ExchangeDAO(address)
    return this._cache[ address ]
  }

  subscribeToCreateExchange (account) {
    const dao = this.getExchangeManagerDAO(account)

    return Promise.all([
      dao.watchExchangeCreated(account, (result) => {
        this.emit('ExchangeCreated', result)
      }),
    ])
  }

  subscribeToExchange (address) {
    if (this._cache[ address ]) return null

    // const dao = token.dao()
    // await dao.watchTransfer(account, (notice) => dispatch(watchTransfer(notice)))

    const dao = this.getExchangeDAO(address)

    return Promise.all([
      dao.watchError((result) => {
        this.emit('Error', result)
      }),
      dao.watchFeeUpdated(address, (result) => {
        this.emit('FeeUpdated', result)
      }),
      dao.watchPricesUpdated(address, (result) => {
        this.emit('PricesUpdated', result)
      }),
      dao.watchActiveChanged(address, (result) => {
        this.emit('ActiveChanged', result)
      }),
      dao.watchBuy(address, (result) => {
        this.emit('Buy', result)
      }),
      dao.watchSell(address, (result) => {
        this.emit('Sell', result)
      }),
      dao.watchWithdrawEther(address, (result) => {
        this.emit('WithdrawEther', result)
      }),
      dao.watchWithdrawTokens(address, (result) => {
        this.emit('WithdrawTokens', result)
      }),
      dao.watchReceivedEther(address, (result) => {
        this.emit('ReceivedEther', result)
      }),
    ])
  }

  subscribeToToken (token: TokenModel, exchange: string) {
    if (!token || this._cache[ `${token.id()}-${exchange}` ]) return null

    const tokenDAO = tokenService.getDAO(token.id())
    this._cache[ `${token.id()}-${exchange}` ] = tokenDAO

    tokenDAO
      .on(EVENT_NEW_TRANSFER, (tx: TxModel) => {
        if (tx.to() === exchange) {
          this.emit('Transfer', tx)
        }
      })
  }
}

export default new ExchangeService()
