import { Record as record } from 'immutable'
import moment from 'moment'
import ChronoMintDAO from '../dao/ChronoMintDAO'

class TransactionModel extends record({
  txHash: null,
  nonce: null,
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
      return ChronoMintDAO.web3.fromWei(this.get('value'), 'ether')
    } else {
      return this.get('value') / 100000000
    }
  }

  // noinspection JSUnusedGlobalSymbols
  sign () {
    return this.credited ? '+' : '-'
  }
}

export default TransactionModel
