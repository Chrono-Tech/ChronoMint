import { LOCAL_ID } from 'network/settings'

const isW = window.hasOwnProperty('localStorage')

const TEST_RPC_ACCOUNT = 'testRPCAccount'
const LOCALE = 'locale'
const LAST_URL = 'lastURL'

const ERROR_NO_TOKEN = 'LocalStorage token not found'

class LocalStorage {
  createSession (account, provider: number, network: number) {
    if (this.token) {
      // eslint-disable-next-line
      console.warn('Session already created', this.token)
      return
    }
    this.account = account // TODO @bshevchenko: all this properties should be private!
    this.provider = provider
    this.network = network
    this.token = `${this.account}-${this.provider}-${this.network}`
    this.localAccount = null
    this.locale = this.getLocale()
    if (provider === LOCAL_ID && network === LOCAL_ID) {
      this.setLocalAccount(account)
    }
    this._memoryWithToken = LocalStorage._getFromLS(this.token) || {}
    // console.info('LocalStorage: session created', this.token)
  }

  isSession () {
    return !!this.token
  }

  getToken () {
    return this.token
  }

  getNetwork () {
    return this.network
  }

  getProvider () {
    return this.provider
  }

  destroySession () {
    this.account = null
    this.provider = null
    this.network = null
    this.token = null
    this._memoryWithToken = {}
    this.localAccount = null
    LocalStorage._removeFromLS(TEST_RPC_ACCOUNT)
    // console.info('LocalStorage: session destroyed')
  }

  setLocalAccount (account) {
    this.localAccount = account
    LocalStorage._setToLS(TEST_RPC_ACCOUNT, account)
  }

  getLocalAccount () {
    return this.localAccount || LocalStorage._getFromLS(TEST_RPC_ACCOUNT)
  }

  /**
   * @param key
   * @private
   */
  static _getFromLS (key: string) {
    try {
      if (isW) {
        return JSON.parse(window.localStorage.getItem(key))
      }
    } catch (e) {
      // eslint-disable-next-line
      console.warn(`LocalStorage: parse error`, e)
    }
  }

  /**
   * @param key
   * @param data
   * @private
   */
  static _setToLS (key: string, data: any) {
    if (isW) {
      window.localStorage.setItem(key, JSON.stringify(data))
    }
  }

  /**
   * @private
   * @param key
   */
  static _removeFromLS (key: string) {
    if (isW) {
      window.localStorage.removeItem(key)
    }
  }

  /**
   * @param key
   * @return {*}
   * @private
   */
  _get (key: string) {
    if (!this.token) {
      // eslint-disable-next-line
      console.warn('get', ERROR_NO_TOKEN)
      return
    }
    // NOTE: read only from memory
    return this._memoryWithToken[key]
  }

  _set (key: string, value: any) {
    if (!this.token) {
      // eslint-disable-next-line
      console.warn('set', ERROR_NO_TOKEN)
      return
    }

    this._memoryWithToken[key] = value
    LocalStorage._setToLS(this.token, this._memoryWithToken)
  }

  // TODO @dkchv: remove this!!! Use state.get('session').account instead
  // TODO @bshevchenko: I've removed @deprecated to hide confusing IDE inspections, we should provide complete and...
  // TODO @bshevchenko: ...proper solution for all cases before marking this method as deprecated.
  getAccount () {
    if (!this.token) {
      // eslint-disable-next-line
      console.warn('getAccount', ERROR_NO_TOKEN)
      return
    }
    return this.account
  }

  setLocale (locale: string) {
    // directly
    this.locale = locale
    LocalStorage._setToLS(LOCALE, locale)
  }

  getLocale () {
    return this.locale || LocalStorage._getFromLS(LOCALE) || 'en'
  }

  setLastURL (url: Object) {
    this._set(LAST_URL, url)
  }

  getLastURL () {
    return this._get(LAST_URL)
  }
}

export default new LocalStorage()
