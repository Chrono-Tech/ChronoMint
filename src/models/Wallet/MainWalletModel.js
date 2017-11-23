import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import { ls } from 'platform'
import { abstractFetchingModel } from '../AbstractFetchingModel'
import TransactionsCollection from './TransactionsCollection'

export default class MainWallet extends abstractFetchingModel({
  address: null,
  tokens: new Immutable.Map(),
  // TODO @dkchv: make as separate fetching model
  transactions: new TransactionsCollection(),
  btcAddress: null,
  bccAddress: null,
  nemAddress: null,
  timeDeposit: new BigNumber(0),
  // TODO @dkchv: !!! was ''
  // TODO @dkchv: maybe not for wallet model
  timeAddress: null,
  isMultisig: false,
  isMainWallet: true,
  // TODO @dkchv: is a part of wallet ?
  isTIMERequired: true,
}) {

  address () {
    // TODO @ipavlenko: Why, Carl? Why you do this? You have address as a record field, please fill it
    return ls.getAccount()
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
