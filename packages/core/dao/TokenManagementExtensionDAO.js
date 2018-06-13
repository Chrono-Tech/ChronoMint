/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TokenModel from '../models/tokens/TokenModel'
import { MultiEventsHistoryABI, TokenManagementInterfaceABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'

export default class TokenManagementExtensionDAO extends AbstractContractDAO {

  constructor (at = null) {
    super(TokenManagementInterfaceABI, at, MultiEventsHistoryABI)
  }

  async createAssetWithFee (token: TokenModel) {
    const fee = token.fee()
    const tx = await this._tx(
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
    return tx.tx
  }

  async createAssetWithoutFee (token: TokenModel) {
    const tx = await this._tx(
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
    return tx.tx
  }
}
