import uuid from 'uuid/v1'
import { findFunctionABI, TransactionDescriber } from '../TransactionDescriber'
import { Amount, LogTxModel } from '../../../models'
import { ERC20DAODefaultABI } from '../../../dao/abi'

export const FUNCTION_POLL_CREATED = new TransactionDescriber(
  findFunctionABI(ERC20DAODefaultABI, 'transfer'),
  ({ tx, block }, { address }, { params, token, abi }) => {
    const symbol = token.symbol()
    address = address.toLowerCase()
    if (symbol && (params._to.toLowerCase() === address || tx.from.toLowerCase() === address)) {

      const transferAmount = new Amount(params._value, symbol)

      const path = `tx.${abi.contractName}.transfer`
      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: 'transfer',
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.title`,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: params._to,
            description: `${path}.to`,
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
