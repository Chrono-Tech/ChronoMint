/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { EthereumLikeDAO } from './EthereumLikeDAO'
import { BLOCKCHAIN_LABOR_HOUR_TOKEN, LHT } from './constants'

export class LaborHourTokenDAO extends EthereumLikeDAO {
  constructor () {
    super(LHT, BLOCKCHAIN_LABOR_HOUR_TOKEN, ...arguments)
  }
}

export default new LaborHourTokenDAO()
