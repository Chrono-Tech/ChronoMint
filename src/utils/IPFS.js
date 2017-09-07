import ipfsAPI from 'ipfs-api'
import promisify from 'promisify-node-callback'
import FileModel from '../models/FileSelect/FileModel'
import { fileConfig } from '../components/common/FileSelect/FileSelect'
import FileCollection from '../models/FileSelect/FileCollection'

const DEFAULT_CONFIG = {
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
}

type webkitURL = {
  createObjectURL: Function
}

class IPFS {

  constructor (config) {
    this._api = ipfsAPI(config || DEFAULT_CONFIG)
  }

  getAPI (): ipfsAPI {
    return this._api
  }

  /**
   * @param value Object that you want to put
   * @returns {Promise<String>} hash of added value
   * @deprecated
   */
  put (value) {
    return new Promise((resolve, reject) => {
      const putValue = value ? {
        Data: Buffer.from(JSON.stringify(value)),
        Links: []
      } : ''
      this.getAPI().object.put(putValue, (err, response) => {
        if (err) {
          return reject(err)
        }
        const hash = response.toJSON().multihash
        resolve(hash)
      })
    }).catch(e => {
      // eslint-disable-next-line
      console.warn('Something wrong with infura, check http://status.infura.io/')
      throw e
    })
  }

  /**
   * @param hash
   * @returns {Promise<any|null>}
   * @deprecated
   */
  async get (hash) {
    if (!hash) {
      return null
    }

    return new Promise(async (resolve) => {
      try {
        // TODO @bshevchenko: this is temporarily, to limit time of data downloading
        setTimeout(() => {
          resolve(null)
        }, 3000)

        const response = await promisify(this.getAPI().object.get)(hash)
        const result = response.toJSON()

        resolve(JSON.parse(Buffer.from(result.data).toString()))

      } catch (e) {
        // eslint-disable-next-line
        console.warn('IPFS get error', e, 'hash', hash)
        resolve(null)
      }
    })
  }

  // TODO @dkchv: remvoe from ipfs to image validator
  getImageDimensions (file) {
    return new Promise(resolve => {
      const URL: webkitURL = window.URL || window.webkitURL
      const img = new Image()
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        })
      }
      img.onerror = () => {
        resolve({
          width: 0,
          height: 0
        })
      }
      img.src = URL.createObjectURL(file.file())
    })
  }

  async checkImageFile (file: FileModel, config: fileConfig) {
    const errors = []

    // parse dimensions
    const {width, height} = await this.getImageDimensions(file)
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
          max: '2:1'
        })
      }
    }
    return errors
  }

  async parseFile (file: FileModel, config: fileConfig) {
    let errors = []

    // check name
    if (!file.name()) {
      errors.push('no file name')
    }

    // check size
    if (file.size() === 0) {
      errors.push('empty file')
    }
    if (file.size() > config.maxFileSize) {
      errors.push({
        value: 'max file size',
        limit: config.maxFileSize
      })
    }

    // check type
    if (!config.accept.includes(file.type())) {
      errors.push('Wrong file type')
    }

    // check image
    if (file.isImage()) {
      const imageErrors = await this.checkImageFile(file, config)
      errors = errors.concat(imageErrors)
    }

    return errors
  }

  getRawData (file: FileModel) {
    return new Promise(resolve => {
      // TODO @dkchv: add timeout
      const reader = new window.FileReader()
      reader.onload = () => resolve(reader.result)
      // TODO: use array buffers instead of base64 strings
      reader.readAsDataURL(file.file())
    })
  }

  async _fileAdd (file: FileModel, config) {
    const parseErrors: Array = await this.parseFile(file, config)
    if (parseErrors.length) {
      return file.uploading(false).uploaded(false).error(parseErrors)
    }
    const content: Buffer = await this.getRawData(file)
    const putValue = Buffer.from(JSON.stringify({
      path: file.path(),
      content
    }))

    try {
      const response = await this._api.object.put(putValue)
      const hash = response.toJSON().multihash
      return file.uploading(false).uploaded(true).hash(hash)
    } catch (e) {
      return file.uploading(false).uploaded(false).error(e.message)
    }
  }

  async _collectionAdd (fileCollection: FileCollection) {
    try {
      const links = fileCollection.links()
      if (links.length === 0) {
        return fileCollection.uploaded(false).uploading(false).hash(null)
      }
      const response = await this._api.object.put(Buffer.from(JSON.stringify({links})))
      const hash = response.toJSON().multihash
      return fileCollection.uploading(false).uploaded(true).hash(hash)
    } catch (e) {
      return fileCollection.uploading(false).uploaded(false).hash(null).error(e.message)
    }
  }

  async uploadFile (file: FileModel, config, callback) {
    try {
      const uploadedFile = await this._fileAdd(file, config)
      callback(uploadedFile)
      return uploadedFile
    } catch (e) {
      const errorFile = file.error(e.message)
      callback(errorFile)
      return errorFile
    }
  }

  async uploadCollection (fileCollection: FileCollection, config, callback) {
    let updatedCollection = fileCollection
    const files = fileCollection.files().filter(item => {
      return !(item.uploaded() || item.hasErrors())
    })
    const promises = []
    files.forEach(file => promises.push(this.uploadFile(file, config, callback)))
    const result = await Promise.all(promises)
    result.forEach(file => {
      updatedCollection = updatedCollection.update(file)
    })

    if (!updatedCollection.hasErrors()) {
      updatedCollection = await this._collectionAdd(updatedCollection)
    }
    return updatedCollection
  }
}

export default new IPFS()
