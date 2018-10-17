/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { BLOCKCHAIN_LABOR_HOUR_TOKEN } from './constants'
import EthereumLikeProvider from './EthereumLikeProvider'
import selectLhtNode from './LhtNode'

export class LaborHourProvider extends EthereumLikeProvider {
  constructor () {
    super(BLOCKCHAIN_LABOR_HOUR_TOKEN, ...arguments)
  }

  async getAccountBalances (address) {
    const node = this._selectNode(this.networkSettings)
    const data = await node.getAddressInfo(address.toLowerCase())
    return {
      balance: data.balance,
      tokens: data.erc20token,
    }
  }
}

export const lhtProvider = new LaborHourProvider(selectLhtNode)
