/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { connect } from 'react-redux'
import {
  IconButton,
  TextField,
} from '@material-ui/core'
import {
  AttachFile,
  Close,
} from '@material-ui/icons'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import * as ProfileThunks from '@chronobank/core/redux/profile/thunks'
import { getFileNameFromPath } from 'utils/common'

import './AvatarSelect.scss'
import Preloader from '../Preloader/Preloader'

function mapDispatchToProps (dispatch) {
  return {
    downloadAvatar: (imageID: string) => dispatch(ProfileThunks.downloadAvatar(imageID)),
    uploadAvatar: (imageFile: any) => dispatch(ProfileThunks.uploadAvatar(imageFile)),
  }
}

@connect(null, mapDispatchToProps)
export default class AvatarSelect extends PureComponent {
  static propTypes = {
    floatingLabelText: PropTypes.node,
    downloadAvatar: PropTypes.func,
    uploadAvatar: PropTypes.func,
  }

  constructor (props, context, updater) {
    super(props, context, updater)

    this.state = {
      isUploadingFile: false,
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

  handleChange = async (e) => {
    if (!e.target.files.length) {
      return
    }
    const file = e.target.files[0]

    if (file){
      this.setState({
        isUploadingFile: true,
        uploadError: null,
      })
      try {
        const response = await this.props.uploadAvatar(file)
        this.handleUploadSuccess(response)
      } catch(error){
        this.handleUploadFail(error)
      }

      this.setState({ isUploadingFile: false })
    }

  }

  handleUploadSuccess (response){
    if (response && response.url) {
      this.setState({
        fileName: getFileNameFromPath(response.url),
      })
      this.props.input.onChange (response.id)
    }
  }

  handleUploadFail (error){
    if (error){
      this.setState({ uploadError: error })
    }
  }

  handleReset = () => {
    this.props.input.onChange('')
    this.setState({ fileName: '' })
  }

  async loadImage (imageId){
    try {
      const data = await this.props.downloadAvatar(imageId)

      this.setState({
        fileName: getFileNameFromPath(data.url),
      })
    } catch (e) {
      // eslint-disable-next-line
      console.log('Failed to load image', imageId)
    }
  }

  refInput = (input) => this.input = input

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
    const { isUploadingFile, fileName } = this.state
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
                onClick={fileName ? this.handleReset : this.handleOpenFileDialog}
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
          ref={this.refInput}
          type='file'
          onChange={this.handleChange}
          styleName='hide'
        />
      </div>
    )
  }
}
