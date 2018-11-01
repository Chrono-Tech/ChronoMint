/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import web3Factory from '@chronobank/core/web3'
import { BLOCKCHAIN_LABOR_HOUR } from './constants'
import AbstractEthereumProvider from './AbstractEthereumProvider'
import selectLaborHourNode from './LaborHourNode'

export class LaborHourProvider extends AbstractEthereumProvider {
  constructor () {
    super(BLOCKCHAIN_LABOR_HOUR, ...arguments)
  }

  async getAccountBalances (address) {
    const balanceData = { tokens: {} }

    try {
      const web3 = web3Factory(this.networkSettings[BLOCKCHAIN_LABOR_HOUR])
      balanceData.balance = await web3.eth.getBalance(address)
      web3.currentProvider.connection.close()
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }

    return balanceData
  }
}

export const laborHourProvider = new LaborHourProvider(selectLaborHourNode)
