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

import './AvatarSelect.scss'
import Preloader from '../Preloader/Preloader'

// defaults
const DEFAULT_MAX_FILE_SIZE = 2 * 1024 * 1024 // 2Mb
// TODO @dkchv: !!! make as [1,2]
const DEFAULT_ASPECT_RATIO = 2 // means 1:2 ... 2:1
const DEFAULT_MAX_FILES = 10

class AvatarSelect extends PureComponent {
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
    handleChange: null,
  }

  constructor (props, context, updater) {
    super(props, context, updater)

    // TODO replace with async arrow when class properties will work correctly
    this.handleChange = this.handleChange.bind(this)
    this.handleFileRemove = this.handleFileRemove.bind(this)
    this.handleReset = this.handleReset.bind(this)

    this.state = {
      isHandlingFile: false,
      isHandledFile: false,
      handleError: null,
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
    const { handleChange } = this.props

    if (!e.target.files.length) {
      return
    }
    const file = e.target.files[0]

    if (handleChange){
      this.setState({ isHandlingFile: true })
      try {
        await handleChange(file)
      } catch(e){
        this.setState({ handleError: e & e.message })
      }
      this.setState({ isHandlingFile: false, isHandledFile: true })
    }

  }

  async handleReset () {
    this.props.onChange()
  }

  getFilesLeft () {
    return Math.max(this.state.config.maxFiles - this.state.fileCollection.size(), 0)
  }

  async loadCollection (hash) {

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
    const { isHandlingFile, isHandledFile, handleError } = this.state
    return (
      <div styleName='iconWrapper'>
        {isHandlingFile
          ? (
            <div styleName='spinner'>
              <Preloader size={18} thickness={1.5} />
            </div>
          )
          : (
            <div styleName='icon'>
              <IconButton
                onClick={isHandledFile ? this.handleReset : this.handleOpenFileDialog}
              >
                {isHandledFile ? <Close /> : <AttachFile />}
              </IconButton>
            </div>
          )}
      </div>
    )
  }

  render () {
    const { config } = this.state

    return (
      <div styleName='root'>
        { this.renderSingle() }

        <input
          ref={(input) => this.input = input}
          type='file'
          onChange={(e) => this.handleChange(e)}
          styleName='hide'
          accept={config.accept.join(', ')}
        />
      </div>
    )
  }
}

export default FileSelect
