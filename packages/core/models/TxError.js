/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export default class TxError extends Error {
  constructor (message, code, codeValue = null) {
    super(message)
    this.code = code
    this.codeValue = codeValue
  }
}
