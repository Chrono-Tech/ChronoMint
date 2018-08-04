/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

class ValidationError extends Error {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = ValidationError
