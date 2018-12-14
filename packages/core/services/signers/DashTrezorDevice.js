/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  BLOCKCHAIN_DASH,
  TESTNET,
} from '../../dao/constants'
import BitcoinTrezorDevice from './BitcoinTrezorDevice'

export default class DashTrezorDevice extends BitcoinTrezorDevice {
  constructor ({ address, network, isTestnet }) {
    super({ address, network, isTestnet })
    this.coin = isTestnet ? TESTNET : BLOCKCHAIN_DASH
  }
}
