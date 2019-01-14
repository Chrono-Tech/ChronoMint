/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import TxModel from '@chronobank/core/models/TxModel'
import TxDescModel from '@chronobank/core/models/TxDescModel'

export const getDerivedPath = (coinType, accountIndex = 0) => {
  return `m/44'/${coinType}'/0'/0/${accountIndex}`
}

export const serializeToTxDescModel = (tx: TxModel): TxDescModel => {
  const tdx = new TxDescModel({
    time: +tx.date('X'),
    blockNumber: tx.blockNumber(),
    blockchain: tx.blockchain(),
    hash: tx.txHash(),
    title: `${tx.symbol()} Updated`,
    value: tx.value(),
    confirmations: tx.confirmations(),
    fee: tx.fee(),
    from: tx.from(),
    to: tx.to(),
    params: [
      {
        name: 'from',
        value: tx.from(),
      },
      {
        name: 'to',
        value: tx.to(),
      },
      {
        name: 'amount',
        value: tx.value(),
      },
    ],
  })
  return tdx
}
