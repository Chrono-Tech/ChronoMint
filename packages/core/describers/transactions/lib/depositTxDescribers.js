import uuid from 'uuid/v1'
import { findFunctionABI, TransactionDescriber } from '../TransactionDescriber'
import { Amount, LogTxModel } from '../../../models'
import { AssetHolderABI } from '../../../dao/abi'
import { TIME } from '../../../dao/constants'
import { TX_DEPOSIT, TX_WITHDRAW_SHARES } from '../../../dao/constants/AssetHolderDAO'

export const FUNCTION_DEPOSIT = new TransactionDescriber(
  findFunctionABI(AssetHolderABI, TX_DEPOSIT),
  ({ tx, block }, { address }, { params }) => {
    address = address.toLowerCase()

    if ((tx.to.toLowerCase() === address || tx.from.toLowerCase() === address)) {
      const transferAmount = new Amount(params._amount, TIME)
      const path = `tx.${AssetHolderABI.contractName}.${TX_DEPOSIT}`

      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: 'transfer',
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.title`,
        eventTitle: `${path}.eventTitle`,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: transferAmount,
            description: `${path}.amount`,
          },
        ],
      })
    }
  },
)

export const FUNCTION_WITHDRAW = new TransactionDescriber(
  findFunctionABI(AssetHolderABI, TX_WITHDRAW_SHARES),
  ({ tx, block }, { address }, { params }) => {
    address = address.toLowerCase()

    if ((tx.to.toLowerCase() === address || tx.from.toLowerCase() === address)) {
      const transferAmount = new Amount(params._amount, TIME)
      const path = `tx.${AssetHolderABI.contractName}.${TX_WITHDRAW_SHARES}`

      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: 'transfer',
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.title`,
        eventTitle: `${path}.eventTitle`,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: transferAmount,
            description: `${path}.amount`,
          },
        ],
      })
    }
  },
)
