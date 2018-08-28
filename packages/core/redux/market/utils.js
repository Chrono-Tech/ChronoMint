/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

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
