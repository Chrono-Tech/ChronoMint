/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { BLOCKCHAIN_ETHEREUM } from './constants'
import EthereumLikeProvider from './EthereumLikeProvider'
import selectEthereumNode from './EthereumNode'

export class EthereumProvider extends EthereumLikeProvider {
  constructor () {
    super(BLOCKCHAIN_ETHEREUM, ...arguments)
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

export const ethereumProvider = new EthereumProvider(selectEthereumNode)
