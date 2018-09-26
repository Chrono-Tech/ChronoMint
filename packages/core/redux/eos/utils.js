/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import ecc from 'eosjs-ecc'
import Eos from 'eosjs'
import ethUtils from 'ethereumjs-util'
import { TxEntryModel } from '../../models'
import Amount from '../../models/Amount'

export const createEosTxEntryModel = (entry) =>
  new TxEntryModel({
    key: uuid(),
    isSubmitted: true,
    isAccepted: false,
    ...entry,
  })

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

export const createEosKeys = (ethereumPrivateKey) => {
  if (ethUtils.isValidPrivate(Buffer.from(ethereumPrivateKey, 'hex'))) {
    // Create EOS owner keys
    const convertedEOSOwnerPrivateKey = ecc.PrivateKey(Buffer.from(ethereumPrivateKey, 'hex')).toWif()
    const convertedEOSOwnerPublicKey = ecc.privateToPublic(convertedEOSOwnerPrivateKey)

    // Create EOS active keys
    const convertedEOSActivePrivateKey = ecc.PrivateKey(Buffer.from(ethereumPrivateKey, 'hex').reverse()).toWif() // TODO implement something more smart
    const convertedEOSActivePublicKey = ecc.privateToPublic(convertedEOSActivePrivateKey)

    // eslint-disable-next-line
    console.log(`eth pk: ${ethereumPrivateKey}`)
    // eslint-disable-next-line
    console.log(`EOS Private owner Key: ${convertedEOSOwnerPrivateKey}`)
    // eslint-disable-next-line
    console.log(`EOS Public owner Key: ${convertedEOSOwnerPublicKey}`)

    // eslint-disable-next-line
    console.log(`EOS Private active Key: ${convertedEOSActivePrivateKey}`)
    // eslint-disable-next-line
    console.log(`EOS Public active Key: ${convertedEOSActivePublicKey}`)

    return {
      owner: {
        priv: convertedEOSOwnerPrivateKey,
        pub: convertedEOSOwnerPublicKey,
      },
      active: {
        priv: convertedEOSActivePrivateKey,
        pub: convertedEOSActivePublicKey,
      },
    }
  } else {
    // eslint-disable-next-line
    console.log("Invalid Ethereum Private Key")
  }
}

export const getEOSBalanceFromStr = (balance: string): Amount => { // "1000.000 EOS"
  const [value, symbol] = balance.split(' ')
  return new Amount(value, symbol)
}

export const prepareTransactionToOfflineSign = async (tx) => {
  const httpEndpoint = 'https://api.jungle.alohaeos.com:443' // TODO move to config
  const chainId = '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca' // TODO move to config
  const eos = Eos({ httpEndpoint, chainId }) // create eos read-only instance

  const expireInSeconds = 60 * 60 // 1 hour
  const info = await eos.getInfo({})
  const chainDate = new Date(info.head_block_time + 'Z')
  let expiration = new Date(chainDate.getTime() + expireInSeconds * 1000)
  expiration = expiration.toISOString().split('.')[0]
  const block = await eos.getBlock(info.last_irreversible_block_num)

  const transactionHeaders = {
    expiration,
    ref_block_num: info.last_irreversible_block_num & 0xFFFF,
    ref_block_prefix: block.ref_block_prefix,
  }
  return { chainId, transactionHeaders, tx }
}
