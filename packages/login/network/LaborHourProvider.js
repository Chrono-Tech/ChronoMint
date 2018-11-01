/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Web3 from 'web3'

import { BLOCKCHAIN_LABOR_HOUR } from './constants'
import AbstractEthereumProvider from './AbstractEthereumProvider'
import selectLaborHourNode from './LaborHourNode'

export const getLaborHourWeb3 = (wssWeb3) => new Web3(new Web3.providers.WebsocketProvider(wssWeb3))

export class LaborHourProvider extends AbstractEthereumProvider {
  constructor () {
    super(BLOCKCHAIN_LABOR_HOUR, ...arguments)
  }

  async getAccountBalances (address) {
    const balanceData = { tokens: {} }

    try {
      const url = this.networkSettings[BLOCKCHAIN_LABOR_HOUR] ? this.networkSettings[BLOCKCHAIN_LABOR_HOUR].wss : 'wss://parity.tp.ntr1x.com:8546'
      const web3 = getLaborHourWeb3(url)
      balanceData.balance = await web3.eth.getBalance(address)
      web3.currentProvider.connection.close()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }

    return balanceData
  }
}

export const laborHourProvider = new LaborHourProvider(selectLaborHourNode)
