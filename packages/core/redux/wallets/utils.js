/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const getDerivedPath = (coinType, accountIndex = 0) => {
  return `m/44'/${coinType}'/0'/0/${accountIndex}`
}
