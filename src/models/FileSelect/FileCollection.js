import Immutable from 'immutable'
import { abstractModel } from '../AbstractModel'
import FileModel from './FileModel'

class FileCollection extends abstractModel({
  files: new Immutable.Map(),
  hash: null,
  uploading: false,
  uploaded: false,
  error: null,
}) {
  add (file: FileModel) {
    return this.set('files', this.files().set(file.id(), file))
  }

  // alias
  update (file: FileModel) {
    return this.add(file)
  }

  remove (id: string) {
    return this.set('files', this.files().remove(id))
  }

  config (value) {
    return this._getSet('config', value)
  }

  hasErrors () {
    return this.files().some((file) => file.hasErrors())
  }

  files () {
    return this.get('files')
  }

  hash (value) {
    return this._getSet('hash', value)
  }

  links () {
    const links = []
    this.files().forEach((file) => links.push({
      name: file.name(),
      hash: file.hash(),
      size: file.size(),
      type: file.type(),
    }))
    return links
  }

  uploading (value) {
    return this._getSet('uploading', value)
  }

  uploaded (value) {
    return this._getSet('uploaded', value)
  }

  error (value) {
    this._getSet('error', value)
  }

  size () {
    return this.files().size
  }
}

export default FileCollection
