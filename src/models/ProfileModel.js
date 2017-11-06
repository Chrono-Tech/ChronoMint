import Immutable from 'immutable'
import { abstractModel } from './AbstractModel'

class ProfileModel extends abstractModel({
  name: null,
  email: null,
  company: null,
  url: null,
  icon: null,
  tokens: new Immutable.Set(),
  assetsManager: new Immutable.Map(),
}) {
  constructor (data = {}) {
    data = data || {}
    super({
      ...data,
      tokens: new Immutable.Set(data.tokens || undefined),
    })
  }

  assetsManager () {
    return this.get('assetsManager')
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
}

export default ProfileModel
