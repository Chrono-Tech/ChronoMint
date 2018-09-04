import uuid from 'uuid/v1'
import type BigNumber from 'bignumber.js'
import coinselect from 'coinselect'
import bitcoin from 'bitcoinjs-lib'
import { TxEntryModel } from '../../models'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_LITECOIN,
} from '../../dao/constants'
import BitcoinMiddlewareService from './BitcoinMiddlewareService'
import {COIN_TYPE_BTC_MAINNET, COIN_TYPE_BTC_TESTNET} from "../../../login/network/constants";

export const createBitcoinTxEntryModel = (entry, options = {}) =>
  new TxEntryModel({
    key: uuid(),
    isSubmitted: true,
    isAccepted: false,
    walletDerivedPath: options && options.walletDerivedPath,
    symbol: options.symbol,
    ...entry,
  })

export const describeTransaction = (to, amount: BigNumber, feeRate, utxos) => {
  const targets = [
    {
      address: to,
      value: amount.toNumber(),
    },
  ]
  const { inputs, outputs, fee } = coinselect(utxos.map((output) => {
    return {
      txId: output.txid,
      vout: output.vout,
      value: Number.parseInt(output.satoshis),
    }
  }), targets, Math.ceil(feeRate))
  return { inputs, outputs, fee }
}

export const createBitcoinWalletFromPK = (privateKey, network) => {
  const bitcoinNetwork = network[BLOCKCHAIN_BITCOIN]
  console.log('createBitcoinWalletFromPK: ', privateKey.substring(2, 66), privateKey.length, bitcoinNetwork)
  const keyPair = new bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey.substring(2, 66), 'hex'), { bitcoinNetwork })
  return {
    keyPair,
    get network () {
      return keyPair.network
    },
    get address () {
      const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network })
      return address
    },
    get derivePath () {
      const coinType = bitcoinNetwork === bitcoin.networks.testnet
        ? COIN_TYPE_BTC_TESTNET
        : COIN_TYPE_BTC_MAINNET
      return `m/44'/${coinType}'/0'/0/0`
    },
  }
}

export const getBtcFee = async (
  {
    address,
    recipient,
    amount,
    formFee,
    blockchain,
    network,
  }) => {
  try {
    const { data } = await getUtxos(address, { blockchain, type: network[blockchain] })
    const { fee } = describeTransaction(recipient, amount, formFee, data)
    return fee
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    throw new Error(e)
  }
}

/**
 * get UTXOS for address
 * @param address
 * @param options
 * @returns {Promise<any>}
 */
const getUtxos = (address, options): Promise<any> => {
  return BitcoinMiddlewareService.getAddressUTXOS(address, options)
}

export const describeBitcoinTransaction = async (to, amount: BigNumber, options) => {
  const { from, feeRate, blockchain, network } = options
  const bitcoinNetwork = bitcoin.networks[network[blockchain]]
  const { data } = await getUtxos(from, { blockchain, type: network[blockchain] })
  const { inputs, outputs, fee } = describeTransaction(to, amount, feeRate, data)

  if (!inputs || !outputs) throw new Error('Bad transaction data')

  const txb = new bitcoin.TransactionBuilder(bitcoinNetwork)
  for (const input of inputs) {
    txb.addInput(input.txId, input.vout)
  }

  for (const output of outputs) {
    if (!output.address) {
      output.address = from
    }
    txb.addOutput(output.address, output.value)
  }

  return {
    tx: txb,
    inputs,
    outputs,
    fee,
  }
}

export const signInputsMap = {
  [BLOCKCHAIN_BITCOIN]: (txb, inputs, signer) => {
    for (let i = 0; i < inputs.length; i++) {
      txb.sign(i, signer.keyPair)
    }
  },
  [BLOCKCHAIN_BITCOIN_CASH]: (txb, inputs, from) => {
    txb.enableBitcoinCash(true)
    txb.setVersion(2)

    const hashType = bitcoin.Transaction.SIGHASH_ALL | bitcoin.Transaction.SIGHASH_BITCOINCASHBIP143
    const wallet = this._walletsMap[from] || this._wallet

    for (let i = 0; i < inputs.length; i++) {
      txb.sign(i, wallet.keyPair, null, hashType, inputs[i].value)
    }
  },
  [BLOCKCHAIN_BITCOIN_GOLD]: (txb, inputs, from) => {
    txb.enableBitcoinGold(true)
    txb.setVersion(2)

    const hashType = bitcoin.Transaction.SIGHASH_ALL | bitcoin.Transaction.SIGHASH_BITCOINCASHBIP143
    const wallet = this._walletsMap[from] || this._wallet

    for (let i = 0; i < inputs.length; i++) {
      txb.sign(i, wallet.keyPair, null, hashType, inputs[i].value)
    }
  },
  [BLOCKCHAIN_LITECOIN]: null, // not specified
}
