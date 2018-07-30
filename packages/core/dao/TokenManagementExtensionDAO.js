/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TokenModel from '../models/tokens/TokenModel'
import AbstractContractDAO from '../refactor/daos/lib/AbstractContractDAO'

export default class TokenManagementExtensionDAO extends AbstractContractDAO {

  constructor ({ address, history, abi }) {
    super({ address, history, abi })
  }

  connect (web3, options) {
    super.connect(web3, options)

    this.allEventsEmitter = this.history.events.allEvents({})
      .on('data', this.handleEventsData)
      .on('changed', this.handleEventsChanged)
      .on('error', this.handleEventsError)
  }

  handleEventsData = (data) => {
    if (!data.event) {
      return
    }

    console.log('TokenManagementExtensionDAO handleEventsData: ', data.event, data)
    this.emit(data.event, data)
  }

  async createAssetWithFee (token: TokenModel) {
    const fee = token.fee()
    await this._tx(
      'createAssetWithFee',
      [
        token.symbol(),
        token.symbol(),
        token.name(),
        token.addDecimals(token.totalSupply()),
        token.decimals(),
        token.isReissuable().value(),
        token.feeAddress(),
        fee.fee() * 100,
        token.icon() ? this._c.ipfsHashToBytes32(token.icon()) : '',
      ],
      token,
    )
  }

  async createAssetWithoutFee (token: TokenModel) {
    await this._tx(
      'createAssetWithoutFee',
      [
        token.symbol(),
        token.symbol(),
        token.name(),
        token.addDecimals(token.totalSupply()),
        token.decimals(),
        token.isReissuable().value(),
        token.icon() ? this._c.ipfsHashToBytes32(token.icon()) : '',
      ],
      token,
    )
  }
}
