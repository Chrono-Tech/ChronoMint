/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export default class ModelBase {
  static DEFAULTS = {}

  constructor (data = {}) {
    this.parse(data)
    Object.freeze(this)
  }

  parse (origData) {
    const defaults = this.constructor.DEFAULTS || ModelBase.DEFAULTS
    const data = Object.assign({}, defaults, origData)

    for (let k in data) {
      if (data.hasOwnProperty(k) && defaults[k] !== undefined) {
        this[ k ] = data[ k ]
      }
    }
  }
}
