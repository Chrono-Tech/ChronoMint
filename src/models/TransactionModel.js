import { abstractModel } from './AbstractModel'
import moment from 'moment'
import Web3Converter from '../utils/Web3Converter' // TODO Get rid of this class here, it's only for contract DAO

class TransactionModel extends abstractModel({
  txHash: null,
  blockHash: null,
  blockNumber: null,
  transactionIndex: null,
  from: null,
  to: null,
  value: null,
  time: null,
  gasPrice: null,
  gas: null,
  input: null,
  credited: null,
  symbol: ''
}) {
  id () {
    return this.txHash + ' - ' + this.from + ' - ' + this.to
  }

  time () {
    return moment.unix(this.get('time')).format('Do MMMM YYYY HH:mm:ss')
  }

  // noinspection JSUnusedGlobalSymbols
  value () {
    if (this.symbol === 'ETH') {
      return Web3Converter.fromWei(this.get('value'))
    } else {
      return this.get('value') / 100000000 // TODO Decimals transformation should occur inside contract DAO
    }
  }

  // noinspection JSUnusedGlobalSymbols
  sign () {
    return this.credited ? '+' : '-'
  }
}

export default TransactionModel
