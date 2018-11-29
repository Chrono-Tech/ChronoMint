/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import { findFunctionABI, TransactionDescriber } from '../TransactionDescriber'
import { LogTxModel } from '../../../models'
import { AtomicSwapERC20ABI } from '../../../redux/laborHour/dao/abi'
import { TX_CLOSE } from '../../../redux/laborHour/dao/AtomicSwapERC20DAO'

export const FUNCTION_SWAP_CLOSE = new TransactionDescriber(
  findFunctionABI(AtomicSwapERC20ABI, TX_CLOSE),
  ({ tx, block }, { address }, { params, feeSymbol }) => {
    address = address.toLowerCase()
    if (tx.to.toLowerCase() === address || tx.from.toLowerCase() === address) {

      const path = `tx.${AtomicSwapERC20ABI.contractName}.${TX_CLOSE}`

      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: TX_CLOSE,
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.title`,
        eventTitle: `${path}.eventTitle`,
        symbol: feeSymbol,
        path,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: params._swapID ? params._swapID.toString() : null,
            description: `${path}.swapID`,
          },
        ],
      })
    }
  },
)
