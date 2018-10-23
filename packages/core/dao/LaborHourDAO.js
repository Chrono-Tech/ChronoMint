/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { laborHourProvider } from '@chronobank/login/network/LaborHourProvider'

import { EthereumLikeDAO } from './EthereumLikeDAO'
import { BLOCKCHAIN_LABOR_HOUR, LHT } from './constants'

export class LaborHourDAO extends EthereumLikeDAO {
  constructor () {
    super(LHT, BLOCKCHAIN_LABOR_HOUR, laborHourProvider, ...arguments)
  }
}

export default new LaborHourDAO()
