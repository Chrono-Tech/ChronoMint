import { abstractFetchingModel } from './AbstractFetchingModel'
import AbstractTokenDAO from '../dao/AbstractTokenDAO'

class TokenModel extends abstractFetchingModel({
  dao: null,
  balance: null,
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
    return this.dao().getSymbol()
  }

  name () {
    return this.dao().getName()
  }

  /** @returns {number} */
  balance () {
    return this.get('balance')
  }

  decimals () {
    return this.dao().getDecimals()
  }

  isFetched () {
    return this.get('isFetched')
  }
}

export default TokenModel
