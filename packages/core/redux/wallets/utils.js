/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bitcoin from 'bitcoinjs-lib'

export const createNewChildAddress = (deriveNumber, blockchain, coinType,bcNetworkId, privateKey) => {
  if (!coinType) {
    return null
  }

  const seedBuffer = Buffer.from(privateKey, 'hex')
  const derivePath = `m/44'/${coinType}'/0'/0/0/${deriveNumber}`
  const wallet = bitcoin.HDNode
    .fromSeedBuffer(seedBuffer, bcNetworkId)
    .derivePath(derivePath)

  return wallet
}

export const isOwner = (wallet, account) => {
  return wallet.owners.includes(account)
}
