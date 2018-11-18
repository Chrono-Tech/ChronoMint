/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TokenModel from '../models/tokens/TokenModel'
import AbstractContractDAO from './AbstractContractDAO'
import web3Converter from '../utils/Web3Converter'
import {
  TX_CREATE_ASSET_WITH_FEE,
  TX_CREATE_ASSET_WITHOUT_FEE,
} from './constants/AssetsManagerDAO'

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

  getSymbol () {
    return 'ETH'
  }

  async createAssetWithFee (token: TokenModel) {
    const fee = token.fee()
    const tx = this._tx(
      TX_CREATE_ASSET_WITH_FEE,
      [
        this.web3.utils.fromAscii(token.symbol()),
        token.symbol(),
        token.name(),
        token.addDecimals(token.totalSupply()),
        token.decimals(),
        token.isReissuable().value(),
        token.feeAddress(),
        fee.fee() * 100,
        token.icon() ? web3Converter.ipfsHashToBytes32(token.icon()) : this.web3.utils.fromAscii(''),
      ],
    )

    return tx
  }

  async createAssetWithoutFee (token: TokenModel) {
    console.log('createAssetWithoutFee: ',   [
      this.web3.utils.fromAscii(token.symbol()),
      token.symbol(),
      token.name(),
      token.addDecimals(token.totalSupply()),
      +token.decimals(),
      token.isReissuable().value(),
      token.icon() ? web3Converter.ipfsHashToBytes32(token.icon()) : this.web3.utils.fromAscii(''),
    ])

    const tx = this._tx(
      TX_CREATE_ASSET_WITHOUT_FEE,
      [
        this.web3.utils.fromAscii(token.symbol()),
        token.symbol(),
        token.symbol(),
        token.addDecimals(token.totalSupply()),
        +token.decimals(),
        token.isReissuable().value(),
        token.icon() ? web3Converter.ipfsHashToBytes32(token.icon()) : this.web3.utils.fromAscii(''),
      ],
    )

    return tx
  }
}
