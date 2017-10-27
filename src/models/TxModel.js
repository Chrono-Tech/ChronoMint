import { FULL_DATE } from 'components/common/Moment'
import BigNumber from 'bignumber.js'
import moment from 'moment'

import { abstractModel } from './AbstractModel'

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
  symbol: '',
  type: '',
  args: null,
}) {
  to () {
    return this.get('to')
  }

  args () {
    return this.get('args')
  }

  type () {
    return this.get('type')
  }

  from () {
    return this.get('from')
  }

  id () {
    return `${this.txHash} - ${this.from()} - ${this.to()}`
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
