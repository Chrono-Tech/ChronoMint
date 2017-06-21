import { abstractModel } from './AbstractModel'
import moment from 'moment'
// noinspection JSFileReferences
import BigNumber from 'bignumber.js'

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

  date (format) {
    return moment.unix(this.get('time')).format(format)
  }

  value () {
    return (new BigNumber(String(this.get('value')))).toString(10)
  }

  // noinspection JSUnusedGlobalSymbols
  sign () {
    return this.credited ? '+' : '-'
  }

  symbol () {
    return this.get('symbol')
  }
}

export default TransactionModel
