import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ipfs from '../../../utils/IPFS'
import { Translate } from 'react-redux-i18n'
import { ACCEPT_ALL } from 'models/FileSelect/FileExtension'
import FileModel from 'models/FileSelect/FileModel'
import FileCollection from 'models/FileSelect/FileCollection'
import FileItem from './FileItem'
import Immutable from 'immutable'
import { CircularProgress, FlatButton } from 'material-ui'
import IconAttach from 'assets/file-select/icon-attach.svg'
import Error from 'material-ui/svg-icons/alert/error'
import Done from 'material-ui/svg-icons/action/done'
import globalStyles from 'styles'
import './FileSelect.scss'

export type fileConfig = {
  accept: Array,
  maxFileSize: number,
  aspectRatio: number,
  maxFiles: number
}

// defaults
const DEFAULT_MAX_FILE_SIZE = 2 * 1024 * 1024 // 2Mb
// TODO @dkchv: !!! make as [1,2]
const DEFAULT_ASPECT_RATIO = 2 // means 1:2 ... 2:1
const DEFAULT_MAX_FILES = 10

class FileSelect extends Component {

  static propTypes = {
    value: PropTypes.string,
    textFieldProps: PropTypes.object,
    mode: PropTypes.string,
    meta: PropTypes.object,
    label: PropTypes.string,
    accept: PropTypes.array,
    multiple: PropTypes.bool,
    maxFileSize: PropTypes.number,
    input: PropTypes.object,
    aspectRatio: PropTypes.number,
    maxFiles: PropTypes.number
  }

  constructor (props) {
    super(props)
    this.state = {
      files: new Immutable.Map(),
      fileCollection: new FileCollection(),
      config: {
        accept: props.accept || ACCEPT_ALL,
        maxFileSize: props.maxFileSize || DEFAULT_MAX_FILE_SIZE,
        aspectRatio: props.aspectRatio || DEFAULT_ASPECT_RATIO,
        maxFiles: props.maxFiles || DEFAULT_MAX_FILES
      }
    }
  }

  async addToIPFS (name, rawData) {
    switch (this.props.mode) {
      case 'object':
        return await this.addToIPFSAsObject(rawData)
      case 'file':
      default:
        return await this.addToIPFSAsFile(name, rawData)
    }
  }

  addToIPFSAsFile (name, rawData) {
    // TODO @dkchv: make promisify if it can
    return new Promise(resolve => {
      ipfs.getAPI().files.add([{
        path: `/${name}`,
        content: rawData
      }], (err, res) => {
        this.setState({isLoading: false})
        if (err) {
          throw err
        }
        if (!res.length) {
          throw new Error('errors.fileUploadingError')
        }

        this.setState({
          isLoaded: true
        })
        this.props.input.onChange(res[0].hash)
        resolve(true)
      })
    })
  }

  async addToIPFSAsObject (rawData) {
    try {
      const hash = await ipfs.put({
        data: rawData
      })
      this.setState({
        isLoading: false,
        isLoaded: true
      })
      this.props.input.onChange(hash)
      return hash
    } catch (e) {
      this.setState({isLoading: false})
      throw e
    }
  }

  handleFileUpdate = (file: FileModel) => {
    this.setState((prevState) => ({
      fileCollection: prevState.fileCollection.update(file)
    }))
  }

  async uploadCollection (files: FileCollection, config: fileConfig) {
    const fileCollection  = await ipfs.uploadCollection(files, config, this.handleFileUpdate)
    this.setState({fileCollection})
    this.props.input.onChange(fileCollection.hash())
  }

  getFilesLeft () {
    return Math.max(this.state.config.maxFiles - this.state.fileCollection.size(), 0)
  }

  handleChange = async (e) => {
    const {config} = this.state
    let fileCollection = this.state.fileCollection.uploading(true)
    let fileModel
    const uploadedFiles = [...e.target.files].slice(0, this.getFilesLeft())
    for (let file of uploadedFiles) {
      fileModel = new FileModel({
        file,
        uploading: true
      })
      fileCollection = fileCollection.add(fileModel)
    }
    this.setState({fileCollection})
    await this.uploadCollection(fileCollection, config)
  }

  handleOpenFileDialog = () => {
    if (!this.state.isLoading) {
      this.input.click()
    }
  }

  handleFileRemove = async (id) => {
    let fileCollection = this.state.fileCollection.remove(id)
    this.setState({
      files: this.state.files.remove(id),
      fileCollection
    })
    await this.uploadCollection(fileCollection, this.state.config)
  }

  renderFiles () {
    const files = this.state.fileCollection.files()
      .map(item => (
        <FileItem
          onRemove={this.handleFileRemove}
          key={item.id()}
          file={item} />
      ))
      .toArray()
    return files.length > 0 && <div styleName='files'>{files}</div>
  }

  renderStatus () {
    const {fileCollection} = this.state
    if (fileCollection.hasErrors()) {
      return <Error color={globalStyles.colors.error} />
    }
    if (fileCollection.uploading()) {
      return <CircularProgress size={16} thickness={1.5} />
    }
    if (fileCollection.uploaded()) {
      return <Done color={globalStyles.colors.success} />
    }
    return null
  }

  render () {
    const {config, fileCollection} = this.state
    const {multiple, meta} = this.props

    return (
      <div>
        {this.renderFiles()}

        <div styleName='attach'>
          <div styleName='attachCounter'>
            <Translate
              value='fileSelect.filesLimit'
              files={fileCollection.size()}
              limit={config.maxFiles}
            />
          </div>
          <div styleName='attachStatus'>{this.renderStatus()}</div>
          <div styleName='attachAction'>
            <FlatButton
              onTouchTap={this.handleOpenFileDialog}
              label={<Translate value='fileSelect.addAttachments' />}
              secondary
              style={{color: globalStyles.colors.blue}}
              icon={<img src={IconAttach} styleName='attachIcon' />}
              disabled={fileCollection.uploading() || this.getFilesLeft() === 0}
            />
          </div>
        </div>

        {fileCollection.error() && <div styleName='error'>{fileCollection.error()}</div>}
        {meta.touched && meta.error && <div styleName='error'>{meta.error}</div>}

        <input
          ref={(input) => this.input = input}
          type='file'
          onChange={this.handleChange}
          styleName='hide'
          multiple={multiple}
          accept={config.accept.join(', ')}
        />
      </div>
    )
  }
}

export default FileSelect
