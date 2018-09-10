/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

// Intermediate model to communicate under the Provider layer
export class WavesTx {
  constructor ({
    type,
    id,
    sender,
    signerPublicKey, // PublicKey
    fee,
    timestamp,
    signature,
    recipient,
    assetId,
    amount,
    feeAsset,
    attachment,
    blockNumber,
    hash,
    address,
  }) {
    this.type = type
    this.id = id
    this.sender = sender
    this.signerPublicKey = signerPublicKey
    this.fee = fee
    this.timestamp = timestamp
    this.signature = signature
    this.recipient = recipient
    this.assetId = assetId
    this.amount = amount
    this.feeAsset = feeAsset
    this.attachment = attachment
    this.blockNumber = blockNumber
    this.hash = hash
    this.address = address
    Object.freeze(this)
  }
}

export class WavesBalance {
  constructor ({
    address,
    balance,
    assets,
  }) {
    this.address = address
    this.balance = balance
    this.assets = assets,
    Object.freeze(this)
  }
}
