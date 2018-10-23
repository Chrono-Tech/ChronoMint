/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { lhtProvider } from '@chronobank/login/network/LhtProvider'

import { EthereumLikeDAO } from './EthereumLikeDAO'
import { BLOCKCHAIN_LABOR_HOUR, LHT } from './constants'

export class LaborHourTokenDAO extends EthereumLikeDAO {
  constructor () {
    super(LHT, BLOCKCHAIN_LABOR_HOUR, lhtProvider, ...arguments)
  }
}

export default new LaborHourTokenDAO()
