import moment from 'moment'
import BigNumber from 'bignumber.js'
import { abstractModel } from './AbstractModel'
import { FULL_DATE } from 'components/common/Moment'

class TxModel extends abstractModel({
  txHash: null,
  blockHash: null,
  blockNumber: null,
  transactionIndex: null,
  from: null,
  to: null,
  value: new BigNumber(0),
  time: null,
  gasPrice: null,
  gas: null,
  gasFee: new BigNumber(0),
  input: null,
  credited: null,
  symbol: ''
}) {
  to () {
    return this.get('to')
  }

  from () {
    return this.get('from')
  }

  id () {
    return this.txHash + ' - ' + this.from() + ' - ' + this.to()
  }

  time () {
    return moment.unix(this.get('time')).format(FULL_DATE)
  }

  date (format) {
    return moment.unix(this.get('time')).format(format)
  }

  value (): BigNumber {
    return this.get('value')
  }

  isCredited () {
    return this.get('credited')
  }

  // noinspection JSUnusedGlobalSymbols
  sign () {
    return this.isCredited() ? '+' : '-'
  }

  symbol () {
    return this.get('symbol')
  }
}

export default TxModel
