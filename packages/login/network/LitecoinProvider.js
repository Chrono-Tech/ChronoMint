/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Address, Networks } from 'litecore-lib'

import { BitcoinProvider } from './BitcoinProvider'
import { selectLTCNode } from './BitcoinNode'
import { BLOCKCHAIN_LITECOIN } from './constants'

export class LitecoinProvider extends BitcoinProvider {
  getNetworkType () {
    return this.networkSettings[BLOCKCHAIN_LITECOIN] === 'testnet' ? Networks.testnet : Networks.livenet
  }

  isAddressValid (address) {
    return Address.isValid(address, this.getNetworkType())
  }
}

export const litecoinProvider = new LitecoinProvider(selectLTCNode, BLOCKCHAIN_LITECOIN)
