/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ipfsAPI from 'ipfs-api'
import promisify from 'promisify-node-callback'
import FileCollection from 'models/FileSelect/FileCollection'
import FileModel, { fileConfig } from 'models/FileSelect/FileModel'
import { imageValidator, FileReader } from 'platform/imageValidator'

const DEFAULT_CONFIG = {
  host: 'ipfs.chronobank.io',
  port: 443,
  protocol: 'https',
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
        Links: [],
      } : ''
      this.getAPI().object.put(putValue, (err, response) => {
        if (err) {
          return reject(err)
        }
        const hash = response.toJSON().multihash
        resolve(hash)
      })
    }).catch((e) => {
      // eslint-disable-next-line
      console.warn('Something wrong with infura, check http://status.infura.io/')
      throw e
    })
  }

  /**
   * @deprecated
   */
  async get (hash, timeout = 5000) {
    if (!hash) {
      return null
    }

    return new Promise(async (resolve) => {
      try {
        // TODO @bshevchenko: this is temporarily, to limit time of data downloading
        setTimeout(() => {
          resolve(null)
        }, timeout)

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
        limit: config.maxFileSize,
      })
    }

    // check type
    if (!config.accept.includes(file.type())) {
      errors.push('Wrong file type')
    }

    // check image
    if (file.isImage()) {
      const imageErrors = await imageValidator(file, config)
      errors = errors.concat(imageErrors)
    }

    return errors
  }

  getRawData (file: FileModel) {
    return new Promise((resolve) => {
      // TODO @dkchv: add timeout
      const reader = new FileReader()
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
      content,
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
      const response = await this._api.object.put(Buffer.from(JSON.stringify({ links })))
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
    const files = fileCollection.files().filter((item) => !(item.uploaded() || item.hasErrors()))
    const promises = []
    files.forEach((file) => promises.push(this.uploadFile(file, config, callback)))
    const result = promises
      ? await Promise.all(promises)
      : []
    result.forEach((file) => {
      updatedCollection = updatedCollection.update(file)
    })

    if (!updatedCollection.hasErrors()) {
      updatedCollection = await this._collectionAdd(updatedCollection)
    }
    return updatedCollection
  }
}

export default new IPFS()
