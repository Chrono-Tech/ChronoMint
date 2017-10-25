import { AlertError, ActionDone, NavigationClose, EditorAttachFile } from 'material-ui/svg-icons'
import { CircularProgress, FlatButton, TextField, IconButton } from 'material-ui'
import IconAttach from 'assets/file-select/icon-attach.svg'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Translate } from 'react-redux-i18n'
import globalStyles from 'styles'

import { ACCEPT_ALL } from 'models/FileSelect/FileExtension'
import FileCollection from 'models/FileSelect/FileCollection'
import FileModel from 'models/FileSelect/FileModel'

import ipfs from 'utils/IPFS'

import FileItem from './FileItem'

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
    maxFiles: PropTypes.number,
  }

  constructor (props, context, updater) {
    super(props, context, updater)

    // TODO replace with async arrow when class properties will work correctly
    this.handleChange = this.handleChange.bind(this)
    this.handleFileRemove = this.handleFileRemove.bind(this)
    this.handleReset = this.handleReset.bind(this)

    this.state = {
      files: new Immutable.Map(),
      fileCollection: new FileCollection(),
      config: {
        accept: props.accept || ACCEPT_ALL,
        maxFileSize: props.maxFileSize || DEFAULT_MAX_FILE_SIZE,
        aspectRatio: props.aspectRatio || DEFAULT_ASPECT_RATIO,
        maxFiles: props.maxFiles || DEFAULT_MAX_FILES,
      },
    }
  }

  componentDidMount () {
    const input = this.props.input
    if (input && input.value) {
      this.loadCollection(this.props.input.value)
    }
  }

  async loadCollection (hash) {
    const data = await ipfs.get(hash)
    let fileCollection = new FileCollection({
      hash,
      uploaded: data && data.links.length,
    })
    if (data && data.links) {
      for (const item of data.links) {
        fileCollection = fileCollection.add(FileModel.createFromLink(item))
      }
    }
    this.setState({
      fileCollection,
    })
  }

  handleFileUpdate = (file: FileModel) => {
    this.setState(prevState => ({
      fileCollection: prevState.fileCollection.update(file),
    }))
  }

  async uploadCollection (files: FileCollection, config: fileConfig) {
    const fileCollection = await ipfs.uploadCollection(files, config, this.handleFileUpdate)
    this.setState({ fileCollection })
    this.props.input.onChange(fileCollection.hasErrors()
      ? `!${fileCollection.hash()}`
      : fileCollection.hash())
  }

  getFilesLeft () {
    return Math.max(this.state.config.maxFiles - this.state.fileCollection.size(), 0)
  }

  async handleChange (e) {
    if (!e.target.files.length) {
      return
    }
    const { config } = this.state
    const { multiple } = this.props
    let fileCollection = multiple
      ? this.state.fileCollection
      : new FileCollection()
    fileCollection = fileCollection.uploading(true)
    let fileModel
    const uploadedFiles = [...e.target.files].slice(0, this.getFilesLeft())
    for (const file of uploadedFiles) {
      fileModel = new FileModel({
        file,
        uploading: true,
      })
      fileCollection = fileCollection.add(fileModel)
    }
    this.setState({ fileCollection })
    await this.uploadCollection(fileCollection, config)
  }

  handleOpenFileDialog = () => {
    this.input.click()
  }

  async handleFileRemove(id) {
    const fileCollection = this.state.fileCollection.remove(id)
    this.setState({
      files: this.state.files.remove(id),
      fileCollection,
    })
    await this.uploadCollection(fileCollection, this.state.config)
  }

  async handleReset () {
    const fileCollection = new FileCollection()
    this.setState({
      fileCollection,
      files: new Immutable.Map(),
    })
    await this.uploadCollection(fileCollection, this.state.config)
  }

  renderFiles () {
    const files = this.state.fileCollection.files()
      .map(item => (
        <FileItem
          onRemove={this.handleFileRemove}
          key={item.id()}
          file={item}
        />
      ))
      .toArray()
    return files.length > 0 && <div styleName='files'>{files}</div>
  }

  renderStatus () {
    const { fileCollection } = this.state
    if (fileCollection.hasErrors()) {
      return <AlertError color={globalStyles.colors.error} />
    }
    if (fileCollection.uploading()) {
      return <CircularProgress size={16} thickness={1.5} />
    }
    if (fileCollection.uploaded()) {
      return <ActionDone color={globalStyles.colors.success} />
    }
    return null
  }

  renderMultiple () {
    const { config, fileCollection } = this.state
    const { meta } = this.props

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
              style={{ color: globalStyles.colors.blue }}
              icon={<img src={IconAttach} styleName='attachIcon' />}
              disabled={this.getFilesLeft() === 0}
            />
          </div>
        </div>

        {fileCollection.error() && <div styleName='error'>{fileCollection.error()}</div>}
        {meta.touched && meta.error && <div styleName='error'>{meta.error}</div>}
      </div>
    )
  }

  renderSingle () {
    const selectedFile = this.state.fileCollection.files().first()
    return (
      <div>
        <div styleName='wrapper'>
          <TextField
            key={selectedFile}
            onTouchTap={this.handleOpenFileDialog}
            fullWidth
            name='singleUpload'
            floatingLabelText={<Translate value='fileSelect.selectFile' />}
            defaultValue={selectedFile && selectedFile.name() || ''}
            readOnly
          />
          {this.renderIcon()}
        </div>
      </div>
    )
  }

  renderIcon () {
    const { fileCollection } = this.state
    return (
      <div styleName='iconWrapper'>
        {fileCollection.uploading()
          ? (
            <div styleName='spinner'>
              <CircularProgress size={18} thickness={1.5} />
            </div>
          )
          : (
            <div styleName='icon'>
              <IconButton
                onTouchTap={fileCollection.uploaded() ? this.handleReset : this.handleOpenFileDialog}
              >
                {fileCollection.uploaded() ? <NavigationClose /> : <EditorAttachFile />}
              </IconButton>
            </div>
          )}
      </div>
    )
  }

  render () {
    const { config } = this.state
    const { multiple } = this.props

    return (
      <div>
        {multiple
          ? this.renderMultiple()
          : this.renderSingle()
        }

        <input
          ref={input => this.input = input}
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
