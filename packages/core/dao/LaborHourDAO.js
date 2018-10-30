/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { laborHourProvider } from '@chronobank/login/network/LaborHourProvider'

import { AbstractEthereumDAO } from './AbstactEthereumDAO'
import { BLOCKCHAIN_LABOR_HOUR, LHT } from './constants'

export class LaborHourDAO extends AbstractEthereumDAO {
  constructor () {
    super(LHT, BLOCKCHAIN_LABOR_HOUR, laborHourProvider, ...arguments)
  }
}

export default new LaborHourDAO()
