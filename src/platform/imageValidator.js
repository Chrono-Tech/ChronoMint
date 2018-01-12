import FileModel, { fileConfig } from 'models/FileSelect/FileModel'

const noopURL = {
  createObjectURL () {
    return ''
  },
}

class NoopFileReader {
  constructor () {
    this.result = null
  }

  onload: () => {}

  readAsDataURL () {
    this.onload()
  }
}

export const url = window ? (window.URL || window.webkitURL) : noopURL
export const FileReader = window ? window.FileReader : NoopFileReader

function getImageDimensions (file) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      })
    }
    img.onerror = () => {
      resolve({
        width: 0,
        height: 0,
      })
    }
    img.src = url.createObjectURL(file.file())
  })
}

const checkImageFile = async (file: FileModel, config: fileConfig) => {
  const errors = []

  // parse dimensions
  const { width, height } = await getImageDimensions(file)
  if (width === 0 || height === 0) {
    errors.push('Wrong image dimensions')
  } else {
    // parse ratio
    const ratio = width / height
    if (ratio > config.aspectRatio || ratio < 1 / config.aspectRatio) {
      errors.push({
        value: 'Wrong image aspect ratio (Limit from 1:2 to 2:1)',
        // TODO @dkchv: !!!
        min: '1:2',
        max: '2:1',
      })
    }
  }
  return errors
}

function noopCheckImageFile () {
  return []
}

export const imageValidator = window ? checkImageFile : noopCheckImageFile
