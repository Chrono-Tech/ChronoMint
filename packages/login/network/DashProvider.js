/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Address, Networks } from 'dashcore-lib'

import { BitcoinProvider } from './BitcoinProvider'
import { selectDASHNode } from './BitcoinNode'
import { BLOCKCHAIN_DASH } from './constants'

export class DashProvider extends BitcoinProvider {
  getNetworkType () {
    return this.networkSettings[BLOCKCHAIN_DASH] === 'testnet' ? Networks.testnet : Networks.livenet
  }

  isAddressValid (address) {
    return Address.isValid(address, this.getNetworkType())
  }
}

export const dashProvider = new DashProvider(selectDASHNode, BLOCKCHAIN_DASH)
