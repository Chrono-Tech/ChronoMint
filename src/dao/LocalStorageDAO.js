const isW = window.hasOwnProperty('localStorage')

const ACCOUNT = 'account'
const LOCALE = 'locale'
const LAST_URLS = 'lastUrls'
const NOTICES = 'notices'
const WEB3_PROVIDER = 'web3Provider'
const NETWORK_ID = 'networkId'
const WATCH_FROM_BLOCK = 'fromBlock-'

class LocalStorageDAO {
  _memory = []

  /**
   * @param key
   * @private
   */
  _get (key: string) {
    try {
      return JSON.parse(isW ? window.localStorage.getItem(key) : this._memory[key])
    } catch (e) {
      return null
    }
  }

  /**
   * @param key
   * @param value
   * @private
   */
  _set (key: string, value) {
    value = JSON.stringify(value)
    if (isW) {
      window.localStorage.setItem(key, value)
      return
    }
    this._memory[key] = value
  }

  _remove (key: string) {
    if (isW) {
      window.localStorage.removeItem(key)
      return
    }
    delete this._memory[key]
  }

  length () {
    return isW ? window.localStorage.length : Object.keys(this._memory).length
  }

  clear () {
    if (isW) {
      window.localStorage.clear()
    }
    this._memory = []
  }

  setAccount (account: string) {
    this._set(ACCOUNT, account)
  }

  getAccount () {
    return this._get(ACCOUNT)
  }

  removeAccount () {
    this._remove(ACCOUNT)
  }

  setLocale (locale: string) {
    this._set(LOCALE, locale)
  }

  getLocale () {
    return this._get(LOCALE)
  }

  setLastUrls (lastUrls: Object) {
    this._set(LAST_URLS, lastUrls)
  }

  getLastUrls () {
    return this._get(LAST_URLS) || {}
  }

  setNotices (notices: Array) {
    this._set(NOTICES, notices)
  }

  getNotices () {
    return this._get(NOTICES) || []
  }

  setWeb3Provider (web3Provider) {
    this._set(WEB3_PROVIDER, web3Provider)
  }

  getWeb3Provider () {
    return this._get(WEB3_PROVIDER)
  }

  setNetworkId (networkId) {
    this._set(NETWORK_ID, networkId)
  }

  removeWeb3Provider () {
    this._remove(WEB3_PROVIDER)
  }

  getNetworkId () {
    return this._get(NETWORK_ID)
  }

  removeNetworkId () {
    this._remove(NETWORK_ID)
  }

  setWatchFromBlock (key: string, block: number) {
    this._set(WATCH_FROM_BLOCK + key, block)
  }

  getWatchFromBlock (key: string) {
    return this._get(WATCH_FROM_BLOCK + key)
  }
}

export default new LocalStorageDAO()
