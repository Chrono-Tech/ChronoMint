import { abstractModel } from '../AbstractModel'
import { IMAGE_MIME_TYPE, DOC_MIME_TYPE, XLS_MIME_TYPE, PPT_MIME_TYPE, PDF_MIME_TYPE } from './FileExtension'

class FileModel extends abstractModel({
  file: null,
  buffer: null,
  uploading: false,
  uploaded: false,
  error: [],
  hash: null,
}) {
  static createFromLink (link) {
    return new FileModel({
      hash: link.hash,
      uploaded: true,
      file: {
        type: link.type,
        size: link.size,
        name: link.name,
        lastModified: 0,
      },
    })
  }

  id () {
    const file = this.file()
    return `${file.name}-${file.lastModified}`
  }

  file () {
    return this.get('file')
  }

  icon () {
    if (this.isImage()) {
      return 'image'
    }
    const type = this.type()
    if (DOC_MIME_TYPE.includes(type)) {
      return 'doc'
    }
    if (XLS_MIME_TYPE.includes(type)) {
      return 'xls'
    }
    if (PPT_MIME_TYPE.includes(type)) {
      return 'ppt'
    }
    if (PDF_MIME_TYPE.includes(type)) {
      return 'pdf'
    }
    return 'default'
  }

  type () {
    return this.file().type
  }

  size () {
    return this.file().size
  }

  name () {
    return this.file().name
  }

  path () {
    return `/${this.name()}`
  }

  isImage () {
    return IMAGE_MIME_TYPE.includes(this.type())
  }

  uploading (value) {
    return value === undefined ? this.get('uploading') : this.set('uploading', value)
  }

  uploaded (value) {
    return value === undefined ? this.get('uploaded') : this.set('uploaded', value)
  }

  hash (value) {
    return value === undefined ? this.get('hash') : this.set('hash', value)
  }

  error (value: any) {
    if (value === undefined) {
      return this.get('error')
    } else if (value === null) {
      // clear
      return this.set('error', [])
    }
    // concat
    const errors = this.get('error')
    return this.set('error', errors.concat(value))
  }

  hasErrors () {
    return this.error().length
  }
}

export default FileModel
