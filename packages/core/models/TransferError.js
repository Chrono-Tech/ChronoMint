/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export default class TransferError extends Error {
  constructor (message, code) {
    super(message)
    this.code = code
  }
}
