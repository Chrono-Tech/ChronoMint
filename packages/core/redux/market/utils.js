/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

// eslint-disable-next-line import/prefer-default-export
export const chunker = (tokens) => {

  const chunk = (list, chunkSize = 5) => {
    if (!list || !list.length) {
      return []
    }

    let i, j, t
    const chunks = []
    for (i = 0, j = list.length; i < j; i += chunkSize) {
      t = list.slice(i, i + chunkSize)
      chunks.push(t)
    }

    return chunks
  }

  const tokenList = tokens.join(',')
  const tLength = tokenList.length // length of comma-separated string of tokens
  const chunkCount = tLength > 600 ? 3 : 2 // amount of chunks required
  const chunks = chunk(tokens, Math.ceil(tokens.length/chunkCount))
  return chunks
}
