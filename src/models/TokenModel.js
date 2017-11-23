import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import type AbstractTokenDAO from 'dao/AbstractTokenDAO'
import type ERC20DAO from 'dao/ERC20DAO'
import { ErrorList } from 'platform'
import validator from 'utils/validator'
import { abstractFetchingModel } from './AbstractFetchingModel'

export default class TokenModel extends abstractFetchingModel({
  dao: null,
  address: null,
  decimals: null,
  name: null,
  symbol: null,
  balance: new BigNumber(0),
  allowance: new Immutable.Map(),
  url: null,
  icon: null,
  fee: null,
  withFee: null,
  platform: null,
  totalSupply: new BigNumber(0),
  managersList: null,
  isReissuable: null,
  isOptional: true, // used in add token dialog for determine its selectable
  feeAddress: null,
}) {
  dao (): AbstractTokenDAO | ERC20DAO {
    return this.get('dao')
  }

  feeAddress () {
    return this.get('feeAddress')
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

  isOptional () {
    return this.get('isOptional')
  }

  setSymbol (v): TokenModel {
    return this.set('symbol', v)
  }

  managersList (value): Array {
    return this._getSet('managersList', value)
  }

  id () {
    return this.symbol()
  }

  name () {
    return this.get('name')
  }

  platform () {
    return this.get('platform')
  }

  fee (value) {
    return this._getSet('fee', value)
  }

  withFee (value) {
    return this._getSet('withFee', value)
  }

  address () {
    return this.dao() ? this.dao().getInitAddress() : this.get('address')
  }

  decimals () {
    return this.dao() ? this.dao().getDecimals() : this.get('decimals')
  }

  balance (): BigNumber {
    return isNaN(this.get('balance')) ? new BigNumber(0) : this.get('balance')
  }

  updateBalance (isCredited, amount: BigNumber): TokenModel {
    const newBalance = this.balance()[isCredited ? 'plus' : 'minus'](amount)
    return this.set('balance', newBalance)
  }

  setBalance (newBalance: BigNumber): TokenModel {
    return this.set('balance', newBalance)
  }

  allowance (spender): BigNumber {
    return this.get('allowance').get(spender) || new BigNumber(0)
  }

  setAllowance (spender, value): TokenModel {
    return this.set('allowance', this.get('allowance').set(spender, value))
  }

  url () {
    return this.get('url')
  }

  icon () {
    return this.get('icon')
  }

  isApproveRequired () {
    const dao = this.get('dao')
    return dao && dao.isApproveRequired() || false
  }

  // noinspection JSUnusedGlobalSymbols
  txSummary () {
    return {
      symbol: this.symbol(),
      name: this.name(),
      totalSupply: this.totalSupply(),
      decimals: this.decimals(),
      isReissuable: this.isReissuable(),
      icon: this.icon(),
      feeAddress: this.feeAddress(),
      feePercent: this.fee(),
      withFee: this.withFee(),
    }
  }
}

// TODO @bshevchenko: MINT-315 add max length for bytes32 variables
export const validate = (values) => {
  const errors = {}
  errors.address = ErrorList.toTranslate(validator.address(values.get('address')))
  errors.name = ErrorList.toTranslate(validator.name(values.get('name')))
  errors.decimals = ErrorList.toTranslate(validator.between(values.get('decimals'), 0, 18))
  errors.url = ErrorList.toTranslate(validator.url(values.get('url'), false))

  if (!/^[A-Z]{2,4}$/.test(values.get('symbol'))) {
    errors.symbol = ErrorList.toTranslate('settings.erc20.tokens.errors.invalidSymbol')
  }

  return errors
}
