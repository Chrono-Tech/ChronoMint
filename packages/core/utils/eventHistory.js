/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { sha3_256 } from 'js-sha3'

export const getHistoryKey = (topics, address) => {
  return sha3_256(address + '-' + topics.join(''))
}
