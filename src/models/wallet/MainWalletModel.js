import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import { abstractFetchingModel } from '../AbstractFetchingModel'
import TransactionsCollection from './TransactionsCollection'

export default class MainWallet extends abstractFetchingModel({
  address: null,
  tokens: new Immutable.Map(),
  transactions: new TransactionsCollection(),
  btcAddress: null,
  bccAddress: null,
  btgAddress: null,
  ltcAddress: null,
  nemAddress: null,
  timeDeposit: new BigNumber(0),
  timeAddress: null,
  isMultisig: false,
  isMainWallet: true,
  // TODO @dkchv: is a part of wallet ?
  isTIMERequired: true,
}) {

  address (address) {
    return this._getSet('address', address)
  }

  tokens (value) {
    return this._getSet('tokens', value)
  }

  timeDeposit (value) {
    return this._getSet('timeDeposit', value)
  }

  timeAddress (value) {
    return this._getSet('timeAddress', value)
  }

  btcAddress (value) {
    return this._getSet('btcAddress', value)
  }

  bccAddress (value) {
    return this._getSet('bccAddress', value)
  }

  btgAddress (value) {
    return this._getSet('btgAddress', value)
  }

  ltcAddress (value) {
    return this._getSet('ltcAddress', value)
  }

  nemAddress (value) {
    return this._getSet('nemAddress', value)
  }

  transactions (value) {
    return this._getSet('transactions', value)
  }

  isTIMERequired (value) {
    return this._getSet('isTIMERequired', value)
  }

  isMultisig () {
    return this.get('isMultisig')
  }
}
