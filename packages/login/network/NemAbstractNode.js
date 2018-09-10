/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

// Intermediate model to communicate under the Provider layer
export class NemTx {
  constructor ({
    txHash,
    time,
    from,
    signer, // PublicKey
    to,
    value,
    fee,
    credited,
    mosaics,
    unconfirmed,
  }) {
    this.txHash = txHash
    this.time = time
    this.from = from
    this.signer = signer
    this.to = to
    this.value = value
    this.fee = fee
    this.credited = credited
    this.mosaics = mosaics
    this.unconfirmed = unconfirmed
    Object.freeze(this)
  }
}

export class NemBalance {
  constructor ({
    address,
    balance,
    mosaics,
  }) {
    this.address = address
    this.balance = balance
    this.mosaics = mosaics,
    // TODO @ipavlenko: Add vested & unvested balances when the middlewar will be ready
    Object.freeze(this)
  }
}
