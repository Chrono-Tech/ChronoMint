import { ethFeeInfo, findFunctionABI, TransactionDescriber } from '../TransactionDescriber'
import { Amount, LogTxModel } from '../../../models'
import ERC20DAODefaultABI from '../../../dao/abi/ERC20DAODefaultABI'

export const FUNCTION_TRANSFER = new TransactionDescriber(
  findFunctionABI(ERC20DAODefaultABI, 'transfer'),
  ({ tx, receipt, block }, { address, dao }, { params }) => {
    const symbol = dao.token.symbol()
    const abi = dao.abi
    address = address.toLowerCase()
    if (symbol && (params._to.toLowerCase() === address || tx.from.toLowerCase() === address)) {
      const {
        amount,
        amountTitle,
      } = ethFeeInfo({ tx, receipt }, { address, symbol })

      const transferAmount = new Amount(params._value, symbol)

      const path = `tx.${abi.contractName}tx.Transfer`
      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : null,
        name: 'transfer',
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.title`,
        amount,
        amountTitle,
        isAmountSigned: true,
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
