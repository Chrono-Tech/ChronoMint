/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  CircularProgress,
  IconButton,
  TextField,
} from '@material-ui/core'
import {
  Done,
  Error,
  AttachFile,
  Close,
} from '@material-ui/icons'
import Button from 'components/common/ui/Button/Button'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import globalStyles from 'styles'
import { ACCEPT_ALL } from '@chronobank/core/models/FileSelect/FileExtension'
import FileCollection from '@chronobank/core/models/FileSelect/FileCollection'
import FileModel, { fileConfig } from '@chronobank/core/models/FileSelect/FileModel'
import ipfs from '@chronobank/core-dependencies/utils/IPFS'
import FileItem from './FileItem'

import './FileSelect.scss'
import Preloader from '../Preloader/Preloader'

// defaults
const DEFAULT_MAX_FILE_SIZE = 2 * 1024 * 1024 // 2Mb
// TODO @dkchv: !!! make as [1,2]
const DEFAULT_ASPECT_RATIO = 2 // means 1:2 ... 2:1
const DEFAULT_MAX_FILES = 10

class FileSelect extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    mode: PropTypes.string,
    // eslint-disable-next-line
    meta: PropTypes.object,
    label: PropTypes.string,
    // eslint-disable-next-line
    accept: PropTypes.array,
    multiple: PropTypes.bool,
    maxFileSize: PropTypes.number,
    // eslint-disable-next-line
    input: PropTypes.object,
    aspectRatio: PropTypes.number,
    maxFiles: PropTypes.number, returnCollection: PropTypes.bool,
    floatingLabelText: PropTypes.node,
    handleChange: PropTypes.func,
  }

  static defaultProps = {
    handleChange: () => {},
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

  handleFileUpdate = (file: FileModel) => {
    this.setState((prevState) => ({
      fileCollection: prevState.fileCollection.update(file),
    }))
  }

  handleOpenFileDialog = () => {
    this.input.click()
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

  async handleFileRemove (id) {
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

  getFilesLeft () {
    return Math.max(this.state.config.maxFiles - this.state.fileCollection.size(), 0)
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

  async uploadCollection (files: FileCollection, config: fileConfig) {
    const fileCollection = await ipfs.uploadCollection(files, config, this.handleFileUpdate)
    this.setState({ fileCollection })
    if (this.props.returnCollection) {
      this.props.input.onChange(fileCollection)
    } else {
      this.props.input.onChange(fileCollection.hasErrors()
        ? `!${fileCollection.hash()}`
        : fileCollection.hash())
    }
  }

  renderFiles () {
    const files = this.state.fileCollection.files()
      .map((item) => (
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

  renderMultiple () {
    const { config, fileCollection } = this.state
    const { meta } = this.props

    return (
      <div>
        {this.renderFiles()}
        <div styleName='attach'>
          <div styleName='attachAction'>
            <Button
              flat
              onClick={this.handleOpenFileDialog}
              disabled={this.getFilesLeft() === 0}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Translate value={this.props.label || 'fileSelect.attachNew'} />
              </div>
            </Button>
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
            onClick={this.handleOpenFileDialog}
            fullWidth
            name='singleUpload'
            label={<Translate value={this.props.floatingLabelText || 'fileSelect.selectFile'} />}
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
              <Preloader size={18} thickness={1.5} />
            </div>
          )
          : (
            <div styleName='icon'>
              <IconButton
                onClick={fileCollection.uploaded() ? this.handleReset : this.handleOpenFileDialog}
              >
                {fileCollection.uploaded() ? <Close /> : <AttachFile />}
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
      <div styleName='root'>
        {multiple
          ? this.renderMultiple()
          : this.renderSingle()
        }

        <input
          ref={(input) => this.input = input}
          type='file'
          onChange={(e) => this.handleChange(e)}
          styleName='hide'
          multiple={multiple}
          accept={config.accept.join(', ')}
        />
      </div>
    )
  }
}

export default FileSelect
