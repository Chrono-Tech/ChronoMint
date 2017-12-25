import { FULL_DATE } from 'models/constants'
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
  by: null,
  value: new BigNumber(0),
  time: null,
  gasPrice: null,
  gas: null,
  fee: new BigNumber(0), // TODO @ipavlenko: remove gasFee, use fee
  gasFee: new BigNumber(0),
  input: null,
  credited: null,
  symbol: '',
  tokenAddress: null,
  type: '',
  token: null, // address
  args: null,
}) {
  tokenAddress (value) {
    return this._getSet('tokenAddress', value)
  }

  to () {
    return this.get('to')
  }

  by () {
    return this.get('by')
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

  symbol (symbol) {
    // TODO @ipavlenko: This is a temorary solution. The reason of this hotfix:
    // DAO layer is subscribed to events from the Provider layer.
    // We have no info about symbol at the Provider level and sometimes we need extend tx info at the DAO layer.
    return this._getSet('symbol', symbol)
  }

  fee () {
    return this.get('fee')
  }

  isFromEmpty () {
    return this.from() === '0x0000000000000000000000000000000000000000'
  }

  /**
   * @deprecated
   */
  token (value) {
    return this._getSet('token', value)
  }
}

export default TxModel
