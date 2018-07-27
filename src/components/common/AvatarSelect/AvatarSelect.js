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
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import ProfileService from '@chronobank/login/network/ProfileService'

import './AvatarSelect.scss'
import Preloader from '../Preloader/Preloader'

export default class AvatarSelect extends PureComponent {
  static propTypes = {
    token: PropTypes.string.isRequired,
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
  }

  constructor (props, context, updater) {
    super(props, context, updater)

    this.state = {
      isUploadingFile: false,
      uploadSuccess: null,
      uploadError: null,
      fileName: '',
    }
  }

  componentDidMount () {
    const input = this.props.input
    if (input && input.value) {
      this.loadImage(this.props.input.value)
    }
  }

  handleOpenFileDialog = () => {
    this.input.click()
  }

  async handleChange (e) {
    const { token } = this.props
    let response

    if (!e.target.files.length) {
      return
    }
    const file = e.target.files[0]
    console.log('filename', file.name)

    if (token && file){
      this.setState({
        isUploadingFile: true,
        uploadError: null,
      })
      try {
        response = await ProfileService.avatarUpload(file, token)
        this.handleUploadSuccess(response)
      } catch(e){
        this.handleUploadFail(response)
      }

      this.setState({ isUploadingFile: false })
    }

  }

  handleUploadSuccess (response){
    if (response && response.url) {
      this.setState({
        uploadSuccess: response,
        fileName: this.getFileNameFromPath(response.url),
      })
      this.props.input.onChange (response.id)
    }
  }

  handleUploadFail (response){
    if (response && response.error){
      this.setState({ uploadError: response.error })
    }
  }

  handleReset () {
    this.props.input.onChange('')
    this.setState({ fileName: '' })
  }

  getFileNameFromPath (path){
    return path && path.replace(/^.*[\\\/]/, '') || ''
  }

  async loadImage (imageId){
    const { token } = this.props

    try {
      const data = await ProfileService.avatarDownload(imageId, token)

      this.setState({
        fileName: this.getFileNameFromPath(data.url),
      })
    } catch (e) {
      // eslint-disable-next-line
      console.log('Failed to load image', imageId)
    }
  }

  renderSingle () {
    const { meta } = this.props
    const { uploadError, fileName } = this.state

    return (
      <div>
        <div styleName='wrapper'>
          <TextField
            onClick={this.handleOpenFileDialog}
            fullWidth
            name='singleUpload'
            label={<Translate value={this.props.floatingLabelText || 'fileSelect.selectFile'} />}
            value={fileName || ''}
            readOnly
          />
          {this.renderIcon()}
        </div>

        {uploadError && <div styleName='error'>{uploadError}</div>}
        {meta.touched && meta.error && <div styleName='error'>{meta.error}</div>}

      </div>
    )
  }

  renderIcon () {
    const { isUploadingFile, uploadSuccess, fileName } = this.state
    return (
      <div styleName='iconWrapper'>
        {isUploadingFile
          ? (
            <div styleName='spinner'>
              <Preloader size={18} thickness={1.5} />
            </div>
          )
          : (
            <div styleName='icon'>
              <IconButton
                onClick={fileName ? this.handleReset.bind(this) : this.handleOpenFileDialog}
              >
                {fileName ? <Close /> : <AttachFile />}
              </IconButton>
            </div>
          )}
      </div>
    )
  }

  render () {
    return (
      <div styleName='root'>
        { this.renderSingle() }

        <input
          ref={(input) => this.input = input}
          type='file'
          onChange={(e) => this.handleChange(e)}
          styleName='hide'
        />
      </div>
    )
  }
}
