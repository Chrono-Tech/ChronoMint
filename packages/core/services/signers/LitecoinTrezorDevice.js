/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { BLOCKCHAIN_LITECOIN, TESTNET } from '../../dao/constants'
import BitcoinTrezorDevice from './BitcoinTrezorDevice'

export default class LitecoinTrezorDevice extends BitcoinTrezorDevice {
  constructor ({ address, network, isTestnet }) {
    super({ address, network, isTestnet })
    this.coin = isTestnet ? TESTNET : BLOCKCHAIN_LITECOIN
  }
}
