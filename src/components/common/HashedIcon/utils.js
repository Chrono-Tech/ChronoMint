/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export function hashCode (str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return hash
}

export function intToRGB (i) {
  return (`00${((i >> 16) & 0xFF).toString(16)}`).slice(-2) +
    (`00${((i >> 8) & 0xFF).toString(16)}`).slice(-2) +
    (`00${(i & 0xFF).toString(16)}`).slice(-2)
}

export function colorFromString (input, multiplier) {
  return `#${intToRGB(hashCode(input) * multiplier)}`
}
