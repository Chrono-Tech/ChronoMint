/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export default class TrezorError extends Error {
  constructor (code, ...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TrezorError)
    }

    this.code = code
  }
}
