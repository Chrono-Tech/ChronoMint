/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

const isW = window.hasOwnProperty('sessionStorage')

class SessionStorage {
  /**
   * @param key
   * @private
   */
  static _getFromSS (key: string) {
    try {
      if (isW) {
        return JSON.parse(window.sessionStorage.getItem(key))
      }
    } catch (e) {
      // eslint-disable-next-line
      console.warn(`SessionStorage: parse error`, e)
    }
  }

  /**
   * @param key
   * @param data
   * @private
   */
  static _setToSS (key: string, data: any) {
    if (isW) {
      window.sessionStorage.setItem(key, JSON.stringify(data))
    }
  }

  /**
   * @private
   * @param key
   */
  static _removeFromSS (key: string) {
    if (isW) {
      window.sessionStorage.removeItem(key)
    }
  }

  static getAccount () {
    return SessionStorage._getFromSS('account')
  }

  static setAccount (account) {
    return SessionStorage._setToSS('account', account)
  }

  static clearAccount () {
    return SessionStorage._removeFromSS('account')
  }

}

export default SessionStorage
