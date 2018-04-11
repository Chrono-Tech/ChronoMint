/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AbstractNode from './AbstractNode'

export default class BitcoinAbstractNode extends AbstractNode {

  async getFeeRate () {
    throw new Error('Not implemented')
  }

  /**
   * @abstract
   * @param address
   */
  // eslint-disable-next-line
  async getAddressUTXOS (address) {
    throw new Error('Not implemented')
  }
}

// Intermediate model to communicate under the Provider layer
export class BitcoinTx {
  constructor ({
    txHash,
    blockHash,
    blockNumber,
    time,
    from,
    to,
    value,
    fee,
    credited,
  }) {
    this.txHash = txHash
    this.blockHash = blockHash
    this.blockNumber = blockNumber
    this.time = time
    this.from = from
    this.to = to
    this.value = value
    this.fee = fee
    this.credited = credited
    Object.freeze(this)
  }
}

export class BitcoinBalance {
  constructor ({
    address,
    balance0,
    balance3,
    balance6,
  }) {
    this.address = address
    this.balance0 = balance0
    this.balance3 = balance3
    this.balance6 = balance6
    Object.freeze(this)
  }
}
