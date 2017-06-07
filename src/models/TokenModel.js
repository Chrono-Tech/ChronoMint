import { abstractFetchingModel } from './AbstractFetchingModel'
import AbstractTokenDAO from '../dao/AbstractTokenDAO'
import validator from '../components/forms/validator'
import ErrorList from '../components/forms/ErrorList'

export default class TokenModel extends abstractFetchingModel({
  dao: null,
  address: null,
  decimals: null,
  name: null,
  symbol: null,
  balance: null,
  url: null,
  icon: null,
  isFetched: false
}) {
  constructor (dao: AbstractTokenDAO = null, balance = null) {
    super({dao, balance})
  }

  /** @returns {AbstractTokenDAO} */
  dao () {
    return this.get('dao')
  }

  symbol () {
    return this.dao() ? this.dao().getSymbol() : this.get('symbol')
  }

  id () {
    return this.symbol()
  }

  name () {
    return this.dao() ? this.dao().getName() : this.get('name')
  }
  
  address () {
    return this.dao() ? this.dao().getInitAddress() : this.get('address')
  }

  decimals () {
    return this.dao() ? this.dao().getDecimals() : this.get('decimals')
  }

  /** @returns {number} */
  balance () {
    return this.get('balance')
  }

  url () {
    return this.get('url')
  }
  
  icon () {
    return this.get('icon')
  }

  isFetched () {
    return this.get('isFetched')
  }
}

export const validate = values => {
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
