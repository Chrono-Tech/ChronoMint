import { abstractFetchingModel } from './AbstractFetchingModel'
import AbstractTokenDAO from '../dao/AbstractTokenDAO'

class TokenModel extends abstractFetchingModel({
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
  constructor (dao: AbstractTokenDAO, balance = null) {
    super({dao, balance})
  }

  /** @returns {AbstractTokenDAO} */
  dao () {
    return this.get('dao')
  }

  symbol () {
    return this.dao() ? this.dao().getSymbol() : null
  }

  name () {
    return this.dao() ? this.dao().getName() : null
  }
  
  address () {
    return this.dao() ? this.dao().getInitAddress() : null
  }

  decimals () {
    return this.dao() ? this.dao().getDecimals() : null
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

export default TokenModel
