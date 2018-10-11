/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'

import { EthereumLikeDAO } from './EthereumLikeDAO'
import { BLOCKCHAIN_ETHEREUM, ETH } from './constants'

export class EthereumDAO extends EthereumLikeDAO {
  constructor () {
    super(ETH, BLOCKCHAIN_ETHEREUM, ethereumProvider, ...arguments)
  }
}

export default new EthereumDAO()
