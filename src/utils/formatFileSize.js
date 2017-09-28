export default function formatFileSize (sizeinbytes = 0) {
  if (isNaN(sizeinbytes)) {
    sizeinbytes = 0
  }
  let fSExt = ['Bytes', 'KB', 'MB', 'GB']
  let fSize = sizeinbytes
  let i = 0
  while (fSize > 900) {
    fSize /= 1024
    i++
  }

  return (Math.round(fSize * 100) / 100) + ' ' + fSExt[i]
}

