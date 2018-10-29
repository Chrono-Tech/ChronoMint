/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import CCC from './ccc-streamer-utilities'
import {
  markets,
  pairs,
} from './constants'

export const prepareSubscriptions = (type = CCC.TYPE.CURRENTAGG) => {
  const subscriptions = []
  for (const pair of pairs) {
    if (type === CCC.TYPE.CURRENT) {
      for (const market of markets) {
        subscriptions.push(`2~${market}~${pair}`)
      }
    } else {
      subscriptions.push(`${type}~CCCAGG~${pair}`)
    }
  }
  return subscriptions
}

// TODO: [AO] need to clarify this algorythm
export const extractMessage = (message) => {
  const messageType = message.substring(0, message.indexOf('~'))

  if (messageType === CCC.TYPE.CURRENTAGG) {
    const result = CCC.unpack(message) || {}
    const keys = Object.keys(result)

    for (let i = 0; i < keys.length; ++i) {
      result[keys[i]] = result[keys[i]]
    }
    result.TOSYMBOL = 'USD'
    result.symbol = result.FROMSYMBOL

    return result
  }
}

// MAX_CHUNK_SIZE is 35 by default. Length of a token may be 3 or 6 characters (especially in testnet)
// 3*35 or 6*35 = ~200 or ~300 characters in comma-separated string
const MAX_CHUNK_SIZE = 35

// eslint-disable-next-line import/prefer-default-export
export const chunker = (tokens) => {

  const chunk = (list, requiredChunkSize = MAX_CHUNK_SIZE) => {
    if (!list || !list.length) {
      return []
    }

    // Let's limit chunks size to 35 due to the reasons in comment above
    const chunkSize = requiredChunkSize > MAX_CHUNK_SIZE ? MAX_CHUNK_SIZE : requiredChunkSize
    let chunkStartIndex, allTokensLength, singleChunk
    const chunks = [] // array of arrays (chunks)

    for (chunkStartIndex = 0, allTokensLength = list.length; chunkStartIndex < allTokensLength; chunkStartIndex += chunkSize) {
      singleChunk = list.slice(chunkStartIndex, chunkStartIndex + chunkSize)
      chunks.push(singleChunk)
    }

    return chunks
  }

  const tLength = tokens.join(',').length // length of comma-separated string of tokens
  const chunkCount = tLength > 600 ? 3 : 2 // amount of chunks required
  const requiredChunkSize =  Math.ceil(tokens.length/chunkCount)
  const chunks = chunk(tokens, requiredChunkSize)
  return chunks
}
