/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
// TODO change imports
// import EosWallet from '@chronobank/login/network/EosWallet'
// import eosSdk from 'eos-sdk'
import { TxEntryModel, TxExecModel } from '../../models'

export const createEosTxEntryModel = (entry, options = {}) =>
  new TxEntryModel({
    key: uuid(),
    receipt: null,
    isSubmitted: true,
    isAccepted: false,
    walletDerivedPath: options && options.walletDerivedPath,
    symbol: options.symbol,
    ...entry,
  })

export const describeEosTransaction = (tx/*, network*/) => {
  // TODO implement method
  // const value = tx.amount.div(DECIMALS).toNumber()
  // Get an empty common object to hold pass and key
  // const common = eosSdk.model.objects.get('common')
  // const transferTransaction = eosSdk.model.objects.create('transferTransaction')(
  //   tx.to,
  //   value,
  //   'Tx from ChronoMint',
  // )

  // const eosNetwork = eosSdk.model.network.data[network.eos]
  // const transactionEntity = eosSdk.model.transactions.prepare('transferTransaction')(common, transferTransaction, eosNetwork.id)
  return new TxExecModel({
    // prepared: transactionEntity,
    hash: null,
    block: null,
    from: tx.from,
    to: tx.to,
  })
}

export const createEosTransaction = (prepared/*, signer, network*/) => {
  // TODO implement method
  // const pk = signer.privateKey.substring(2, 66) // remove 0x
  // const menNetwork = eosSdk.model.network.data[network.eos]
  // const eosWallet = EosWallet.fromPrivateKey(pk, menNetwork)
  // const pubKey = eosWallet._keyPair.publicKey.toString('hex') // get public key for tx
  //
  // const serialized = eosSdk.utils.serialization.serializeTransaction({ ...prepared, signer: pubKey })
  // const signature = eosWallet.sign(serialized)
  return {
    tx: {
      // address: eosWallet.getAddress(),
      // data: eosSdk.utils.convert.ua2hex(serialized),
      // signature: signature.toString(),
    },
    fee: prepared.fee,
  }
}
