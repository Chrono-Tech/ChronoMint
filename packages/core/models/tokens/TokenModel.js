/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import OwnerCollection from '../wallet/OwnerCollection'
import BigNumber from 'bignumber.js'
import type AbstractTokenDAO from '../../dao/AbstractTokenDAO'
import type ERC20DAO from '../../dao/ERC20DAO'
import Amount from '../Amount'
import { abstractFetchingModel } from '../AbstractFetchingModel'
import FeeModel from './FeeModel'
import ReissuableModel from './ReissuableModel'
import PausedModel from './PausedModel'
import BlacklistModel from './BlacklistModel'

export default class TokenModel extends abstractFetchingModel({
  dao: null,
  address: null,
  decimals: 0,
  name: null,
  symbol: null,
  balance: new Amount(0, null, false),
  url: null,
  icon: null,
  fee: new FeeModel(),
  feeRate: null, // Default token fee per byte
  platform: null,
  totalSupply: new Amount(0, null, false),
  managersList: new OwnerCollection(),
  isReissuable: new ReissuableModel(),
  blockchain: null,
  isERC20: false,
  isLocked: false, // flag for do not operate this token
  isPaused: new PausedModel(),
  blacklist: new BlacklistModel(),
  latestBlock: null,
}) {
  id () {
    return this.get('transactionHash') || this.symbol() || this.address()
  }

  dao (): AbstractTokenDAO | ERC20DAO {
    return this.get('dao')
  }

  blockchain () {
    return this.get('blockchain')
  }

  feeAddress () {
    return this.fee().feeAddress()
  }

  symbol () {
    return this.dao() ? this.dao().getSymbol() : this.get('symbol')
  }

  totalSupply (value) {
    return this._getSet('totalSupply', value)
  }

  isReissuable (value) {
    return this._getSet('isReissuable', value)
  }

  setSymbol (v): TokenModel {
    return this.set('symbol', v)
  }

  managersList (value): Array {
    return this._getSet('managersList', value)
  }

  name (value) {
    return this._getSet('name', value)
  }

  platform () {
    return this.get('platform')
  }

  fee (value) {
    return this._getSet('fee', value)
  }

  feeRate (value) {
    return this._getSet('feeRate', value)
  }

  withFee () {
    return this.fee().withFee()
  }

  address () {
    return this.dao() ? this.dao().getInitAddress() : this.get('address')
  }

  decimals () {
    return this.get('decimals')
  }

  addDecimals (amount: BigNumber): BigNumber {
    const amountBN = new BigNumber(amount.toString())
    return amountBN.mul(Math.pow(10, this.decimals()))
  }

  removeDecimals (amount: Amount | BigNumber): Amount {
    const amountBN = new BigNumber(amount)
    return amountBN.div(Math.pow(10, this.decimals()))
  }

  /**
   * @deprecated
   */
  balance (): Amount {
    return isNaN(this.get('balance')) ? new Amount(0) : this.get('balance')
  }

  /**
   * @deprecated
   */
  updateBalance (isCredited, amount: Amount): TokenModel {
    const newBalance = this.balance()[ isCredited ? 'plus' : 'minus' ](amount)
    return this.set('balance', newBalance)
  }

  /**
   * @deprecated
   */
  setBalance (newBalance: Amount): TokenModel {
    return this.set('balance', newBalance)
  }

  url (value) {
    return this._getSet('url', value)
  }

  icon () {
    return this.get('icon')
  }

  // noinspection JSUnusedGlobalSymbols
  txSummary () {
    const fee = this.fee()
    return {
      symbol: this.symbol(),
      name: this.name(),
      totalSupply: this.totalSupply(),
      decimals: this.decimals(),
      isReissuable: this.isReissuable().value(),
      icon: this.icon(),
      feeAddress: fee.feeAddress(),
      feePercent: fee.fee(),
      withFee: fee.withFee(),
    }
  }

  isERC20 (value) {
    return this._getSet('isERC20', value)
  }

  isLocked () {
    return this.get('isLocked')
  }

  isPaused (value) {
    return this._getSet('isPaused', value)
  }

  blacklist (value) {
    return this._getSet('blacklist', value)
  }
}
