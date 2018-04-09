/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export default function formatFileSize (sizeinbytes = 0) {
  if (isNaN(sizeinbytes)) {
    sizeinbytes = 0
  }
  const fSExt = ['Bytes', 'KB', 'MB', 'GB']
  let fSize = sizeinbytes
  let i = 0
  while (fSize > 900) {
    fSize /= 1024
    i++
  }

  return `${Math.round(fSize * 100) / 100} ${fSExt[i]}`
}

