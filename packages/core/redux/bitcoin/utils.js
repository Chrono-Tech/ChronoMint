/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import coinselect from 'coinselect'
import bitcoin from 'bitcoinjs-lib'
import {
  COIN_TYPE_BTC_MAINNET,
  COIN_TYPE_ALLCOINS_TESTNET,
} from '@chronobank/login/network/constants'
import { TxExecModel } from '../../models'
import { getDerivedPath } from '../wallets/utils'

const SATOSHI_TO_BTC = 100000000

export { createBitcoinTxEntryModel } from '../bitcoin-like-blockchain/utils'

/**
 * Get unused exits to create new transaction
 * @param {string} to - recipient's address
 * @param {BigNumber} amount - amount of tokens to be sent
 * @param {number} feeRate - fee rate, obviously.
 * @param {Object} utxos - unused exits from current block which will be used
 */
export const selectCoins = (to, amount: BigNumber, feeRate, utxos) => {
  const targets = [
    {
      address: to,
      value: amount.toNumber(),
    },
  ]
  const utxosArray = utxos.map((output) => ({
    txId: output.txid,
    vout: output.vout,
    value: Number.parseInt(output.satoshis),
  }))

  // An unspent transaction output (UTXO) selection
  const { inputs, outputs, fee } = coinselect(utxosArray, targets, Math.ceil(feeRate))

  // TODO: need to process a case, if some of inputs, outputs or fee is undefined... Here or outside
  return { inputs, outputs, fee }
}

export const getBitcoinDerivedPath = (networkName) => {
  const coinType = networkName === bitcoin.networks.testnet
    ? COIN_TYPE_ALLCOINS_TESTNET
    : COIN_TYPE_BTC_MAINNET
  return getDerivedPath(coinType)
}

export const getBtcFee = (
  recipient,
  amount,
  formFee,
  utxos,
) => {
  const { fee } = selectCoins(recipient, amount, formFee, utxos)
  return fee
}

export const convertSatoshiToBTC = (satoshiAmount) => {
  return new BigNumber(satoshiAmount / SATOSHI_TO_BTC)
}

const describeBitcoinTransaction = (tx, options, utxos) => {
  const { to, from, value } = tx
  const { feeRate, blockchain, network } = options
  const bitcoinNetwork = bitcoin.networks[network[blockchain]]
  const { inputs, outputs, fee } = selectCoins(to, value, feeRate, utxos)

  if (!inputs || !outputs) {
    throw new Error(`Cannot describe ${blockchain} transaction. Bad transaction data.`)
  }

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

export const prepareBitcoinTransaction = (tx, token, network, utxos, feeMultiplier = 1, satPerByte = null) => () => {
  const tokenRate = satPerByte || token.feeRate() // TODO: What if satPerByte will be zero (not null)?
  const options = {
    from: tx.from,
    feeRate: new BigNumber(tokenRate).mul(feeMultiplier),
    blockchain: token.blockchain(),
    network,
  }
  const prepared = describeBitcoinTransaction(tx, options, utxos)

  return new TxExecModel({
    from: tx.from,
    to: tx.to,
    amount: new BigNumber(tx.value),
    fee: new BigNumber(prepared.fee),
    prepared: prepared.tx,
    inputs: prepared.inputs,
    outputs: prepared.outputs,
  })
}
