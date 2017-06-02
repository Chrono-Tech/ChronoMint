import { abstractModel } from './AbstractModel'
import moment from 'moment'

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
  symbol: '',
  rawTx: null // response data
}) {
  id () {
    return this.txHash + ' - ' + this.from + ' - ' + this.to
  }

  time () {
    return moment.unix(this.get('time')).format('Do MMMM YYYY HH:mm:ss')
  }

  value () {
    return this.get('value')
  }

  // noinspection JSUnusedGlobalSymbols
  sign () {
    return this.credited === null ? null
      : this.credited ? '+' : '-'
  }

  symbol () {
    return this.get('symbol')
  }
}

export default TransactionModel
