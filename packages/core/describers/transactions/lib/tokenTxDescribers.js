import BigNumber from 'bignumber.js'
import { TransactionDescriber, findFunctionABI, ethFeeInfo } from '../TransactionDescriber'
import { LogTxModel, Amount } from '../../../models'
import ERC20DAODefaultABI from '../../../dao/abi/ERC20DAODefaultABI'

export const FUNCTION_TRANSFER = new TransactionDescriber(
  findFunctionABI(ERC20DAODefaultABI, 'transfer'),
  ({ /*log,*/ tx, receipt, block }, { address, /*agents,*/ getters }, { /*inputs,*/ params /*, abi */ }) => {
    address = address.toLowerCase()
    const token = getters['tokens/getToken'](tx.to)
    if (token && (params._to.toLowerCase() === address || tx.from.toLowerCase() === address)) {
      const {
        amount,
        amountTitle,
      } = ethFeeInfo({ tx, receipt }, { address, getters })

      const transferAmount = new Amount({
        token,
        value: new BigNumber(params._value),
      })

      return new LogTxModel({
        key: `${block.hash}/${tx.transactionIndex}`,
        name: 'transfer',
        date: new Date(block.timestamp * 1000),
        title: `Transfer ${transferAmount.token.token.symbol} ${transferAmount.amount.toString()} to`,
        message: params._to,
        amount,
        amountTitle,
        isAmountSigned: true,
      })
    }
  },
)

export const FUNCTION_APPROVAL = new TransactionDescriber(
  findFunctionABI(ERC20DAODefaultABI, 'approve'),
  ({ /*log,*/ tx, receipt, block }, { address/*, agents*/, getters }, { /*inputs,*/ params/*, abi*/ }) => {
    address = address.toLowerCase()
    const token = getters['tokens/getToken'](tx.to)
    if (token && (params._spender.toLowerCase() === address || tx.from.toLowerCase() === address)) {
      const {
        amount,
        amountTitle,
      } = ethFeeInfo({ tx, receipt }, { address, getters })

      const approveAmount = new Amount({
        token,
        value: new BigNumber(params._value),
      })

      return new LogTxModel({
        key: `${block.hash}/${tx.transactionIndex}`,
        name: 'approval',
        date: new Date(block.timestamp * 1000),
        title: `Approve ${approveAmount.formatString(false)} to`,
        message: params._spender,
        amount,
        amountTitle,
        isAmountSigned: true,
      })
    }
  },
)

/*export const FUNCTION_WITHDRAW = new TransactionDescriber(
  findFunctionABI(WrappedEtherToken, 'withdraw'),
  ({ log, tx, receipt, block }, { address, agents, getters }, { inputs, params, abi }) => {
    address = address.toLowerCase()
    const token = getters['tokens/getToken'](tx.to)
    if (token && tx.from.toLowerCase() === address) {
      const {
        amount,
        amountTitle,
      } = ethFeeInfo({ tx, receipt }, { address, getters })

      const withdrawAmount = new Amount({
        token,
        value: new BigNumber(params.value),
      })

      return new LogTxModel({
        key: `${block.hash}/${tx.transactionIndex}`,
        name: 'withdraw',
        date: new Date(block.timestamp * 1000),
        title: `Withdraw ${withdrawAmount.formatString(false)} from`,
        message: tx.from,
        amount,
        amountTitle,
        isAmountSigned: true,
      })
    }
  },
)*/

/*export const FUNCTION_DEPOSIT = new TransactionDescriber(
  findFunctionABI(WrappedEtherToken, 'deposit'),
  ({ log, tx, receipt, block }, { address, agents, getters }, { inputs, params, abi }) => {
    address = address.toLowerCase()
    const token = getters['tokens/getToken'](tx.to)
    if (token && tx.from.toLowerCase() === address) {
      const {
        amount,
        amountTitle,
      } = ethFeeInfo({ tx, receipt }, { address, getters })

      const withdrawAmount = new Amount({
        token,
        value: new BigNumber(tx.value),
      })

      return new LogTxModel({
        key: `${block.hash}/${tx.transactionIndex}`,
        name: 'deposit',
        date: new Date(block.timestamp * 1000),
        title: `Deposit ${withdrawAmount.formatString(false)} to`,
        message: tx.from,
        amount,
        amountTitle,
        isAmountSigned: true,
      })
    }
  },
)*/
