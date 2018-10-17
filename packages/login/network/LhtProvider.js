/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Web3 from 'web3'

import { BLOCKCHAIN_LABOR_HOUR_TOKEN } from './constants'
import EthereumLikeProvider from './EthereumLikeProvider'
import selectLhtNode from './LhtNode'

export class LaborHourProvider extends EthereumLikeProvider {
  constructor () {
    super(BLOCKCHAIN_LABOR_HOUR_TOKEN, ...arguments)
  }

  async getAccountBalances (address) {
    const balanceData = { tokens: {} }

    try {
      const web3 = new Web3(new Web3.providers.WebsocketProvider(this.networkSettings[BLOCKCHAIN_LABOR_HOUR_TOKEN].wss))
      balanceData.balance = await web3.eth.getBalance(address)
      web3.currentProvider.connection.close()
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }

    return balanceData
  }
}

export const lhtProvider = new LaborHourProvider(selectLhtNode)
