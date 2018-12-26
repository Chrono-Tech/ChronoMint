/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

module.exports = function (source) {
  if (this.cacheable) {
    this.cacheable()
  }

  let value = typeof source === "string"
    ? JSON.parse(source)
    : source

  const { contractName, abi, networks } = value

  value = JSON.stringify({ contractName, abi, networks })
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')

    return value
}
