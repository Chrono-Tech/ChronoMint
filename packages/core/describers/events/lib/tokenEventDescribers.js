import BigNumber from 'bignumber.js'
import { EventDescriber, findEventABI } from '../EventDescriber'
import { LogEventModel, Amount } from '../../../models'
import ERC20DAODefaultABI from '../../../dao/abi/ERC20DAODefaultABI'

export const EVENT_TRANSFER = new EventDescriber(
  findEventABI(ERC20DAODefaultABI, 'Transfer'),
  ({ log, /*tx, receipt,*/ block }, { address, /*agents,*/ getters }, { /*inputs,*/ params /*abi*/ }) => {
    address = address.toLowerCase()
    const token = getters['tokens/getToken'](log.address)
    if (token && (params._from.toLowerCase() === address || params._to.toLowerCase() === address)) {
      let value = null
      let outgoing = false
      if (params._to.toLowerCase() === address && params._from.toLowerCase() === address) {
        value = new BigNumber(0)
        outgoing = true
      } else if (params._from.toLowerCase() === address) {
        value = (new BigNumber(params._value)).multipliedBy(-1)
        outgoing = true
      } else {
        value = new BigNumber(params._value)
      }
      return new LogEventModel({
        key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
        type: 'event',
        name: 'Transfer',
        date: new Date(block.timestamp * 1000),
        icon: 'event',
        title: outgoing
          ? 'Transfer to'
          : 'Transfer from',
        message: outgoing
          ? params._to
          : params._from,
        target: null,
        isAmountSigned: true,
        amount: new Amount({
          token,
          value,
        }),
      })
    }
    return null
  },
)

export const EVENT_APPROVAL = new EventDescriber(
  findEventABI(ERC20DAODefaultABI, 'Approval'),
  ({ log, /*tx, receipt,*/ block }, { address, /*agents,*/ getters }, { /*inputs,*/ params /*abi*/ }) => {
    address = address.toLowerCase()
    const token = getters['tokens/getToken'](log.address)
    if (token && (params._owner.toLowerCase() === address || params._spender.toLowerCase() === address)) {
      const value = new BigNumber(params._value)
      let outgoing = false
      if (params._owner.toLowerCase() === address && params._spender.toLowerCase() === address) {
        outgoing = true
      } else if (params._owner.toLowerCase() === address) {
        outgoing = true
      } else {
        // ignore
      }
      return new LogEventModel({
        key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
        type: 'event',
        name: 'Approval',
        date: new Date(block.timestamp * 1000),
        icon: 'event',
        title: outgoing
          ? 'Approval for'
          : 'Approval from',
        message: outgoing
          ? params._spender
          : params._owner,
        target: null,
        amount: new Amount({
          token,
          value,
        }),
      })
    }
    return null
  },
)
