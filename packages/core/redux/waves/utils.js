/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import BigNumber from 'bignumber.js'
import { TxEntryModel, TxExecModel } from '../../models'

export const createWavesTxEntryModel = (entry, options = {}) => {
  return new TxEntryModel({
    key: uuid(),
    receipt: null,
    isSubmitted: true,
    isAccepted: false,
    walletDerivedPath: options && options.walletDerivedPath,
    symbol: options.symbol,
    ...entry,
  })
}

const describeWavesTransaction = (tx, options, utxos) => {
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

export const prepareWavesTransaction = (tx, token, network, utxos, feeMultiplier = 1, satPerByte = null) => () => {
  const tokenRate = satPerByte || token.feeRate() // TODO: What if satPerByte will be zero (not null)?
  const options = {
    from: tx.from,
    feeRate: new BigNumber(tokenRate).mul(feeMultiplier),
    blockchain: token.blockchain(),
    network,
  }
  const prepared = describeWavesTransaction(tx, options, utxos)

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
