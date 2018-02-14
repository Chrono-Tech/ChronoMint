import Immutable from 'immutable'
import { abstractModel } from './AbstractModel'
import TokenModel from './tokens/TokenModel'

class ProfileModel extends abstractModel({
  name: null,
  email: null,
  company: null,
  url: null,
  icon: null,
  tokens: new Immutable.Set(),
  version: null,
  hash: null,
}) {
  constructor (data = {}) {
    data = data || {}
    super({
      ...data,
      tokens: new Immutable.Set(data.tokens || undefined),
    })
  }

  version (value) {
    return this._getSet('version', value)
  }

  name () {
    return this.get('name')
  }

  email () {
    return this.get('email')
  }

  company () {
    return this.get('company')
  }

  url () {
    return this.get('url')
  }

  icon () {
    return this.get('icon')
  }

  tokens (value): Immutable.Set {
    return this._getSet('tokens', value)
  }

  isEmpty () {
    return this.get('name') === null
  }

  hash () {
    return this.get('hash') || { isFetching: () => true }
  }

  txSummary () {
    const tokens = {
      show: [],
      hide: [],
    }
    this.tokens().map((item) => {
      if (item.show) {
        tokens.show.push(item.symbol || item.address)
      } else {
        tokens.hide.push(item.symbol || item.address)
      }
    }).join(', ')
    return {
      name: this.name(),
      email: this.email(),
      company: this.company(),
      url: this.url(),
      icon: this.icon(),
      shownTokens: tokens.show.join(', '),
      hideTokens: tokens.hide.join(', '),
    }
  }
}

// TODO @ipavlenko: Make this method a member of ProfileModel, refactor usages
export const isTokenChecked = (token: TokenModel, { blockchain, address, symbol }) => {
  const checkBlockchain = token.blockchain() === blockchain
  const checkItem = address ? address === token.address() : symbol === token.symbol()
  return checkBlockchain && checkItem
}

export default ProfileModel
