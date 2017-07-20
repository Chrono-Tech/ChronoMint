import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CircularProgress, IconButton, TextField } from 'material-ui'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import EditorAttachFile from 'material-ui/svg-icons/editor/attach-file'
import ipfs from '../../../utils/IPFS'
import { Translate } from 'react-redux-i18n'
import './FileSelect.scss'

// presets
export const ACCEPT_DOCS = ['application/pdf', 'text/*', '.doc', '.docx']
export const ACCEPT_IMAGES = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png']
export const ACCEPT_IMAGES_AND_DOC = ACCEPT_DOCS.concat(ACCEPT_IMAGES)
// defaults
const DEFAULT_MAX_FILE_SIZE = 2 * 1024 * 1024 // 2Mb
const DEFAULT_ASPECT_RATIO = 2 // means 1:2 ... 2:1

class FileSelect extends Component {

  static propTypes = {
    value: PropTypes.string,
    textFieldProps: PropTypes.object,
    mode: PropTypes.string,
    meta: PropTypes.object,
    label: PropTypes.string,
    accept: PropTypes.array,
    multiple: PropTypes.bool,
    fileSize: PropTypes.number,
    input: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      isLoading: false,
      isLoaded: false,
      error: null,
      accept: props.accept || ACCEPT_IMAGES_AND_DOC,
      files: []
    }
  }

  componentWillMount () {
    this.setState({isLoaded: !!this.props.value})
  }

  getImageDimensions (file) {
    return new Promise(resolve => {
      const _URL = window.URL || window.webkitURL
      const img = new Image()
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        })
      }
      img.src = _URL.createObjectURL(file)
    })
  }

  async checkImageFile (file) {
    // parse size
    if (file.size > DEFAULT_MAX_FILE_SIZE) {
      throw new Error('Exceeded the maximum file size (Limit: 2Mb)')
    }

    // parse dimensions
    const {width, height} = await this.getImageDimensions(file)
    if (width === 0 || height === 0) {
      throw new Error('Wrong image sizes')
    }

    // parse ratio
    const ratio = width / height
    if (ratio > DEFAULT_ASPECT_RATIO || ratio < 1 / DEFAULT_ASPECT_RATIO) {
      throw new Error('WWrong image aspect ratio (Limit from 1:2 to 2:1)')
    }

    // all tests passed
    return file
  }

  parseFile (file = {}) {
    if (!file.name) {
      throw new Error('No file name')
    }

    if (!this.state.accept.includes(file.type)) {
      throw new Error('Wrong file type')
    }

    if (ACCEPT_IMAGES.includes(file.type)) {
      return this.checkImageFile(file)
    }
    if (ACCEPT_DOCS.includes(file.type)) {
      return file
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

  getRawData (file) {
    return new Promise(resolve => {
      const reader = new window.FileReader()
      reader.onload = () => resolve(reader.result)
      // TODO: use array buffers instead of base64 strings
      reader.readAsDataURL(file)
    })
  }

  handleChange = async (e) => {
    this.setState({
      isLoading: true,
      isLoaded: false,
      error: null
    })
    const uploadedFiles = e.target.files || []
    const files = []

    for (let file of uploadedFiles) {
      try {
        let parsedFile = await this.parseFile(file)
        let rawData = await this.getRawData(file)
        let isLoaded = await this.addToIPFS(file.name, rawData)
        if (isLoaded) {
          files.push(parsedFile)
        }
      } catch (e) {
        this.setState({
          error: e.message,
          isLoading: false
        })
        // TODO @bshevchenko: Improve FileSelect
        // eslint-disable-next-line
        console.error(e)
      }
    }

    this.setState({files})
  }

  handleOpenFileDialog = () => {
    if (!this.state.isLoading) {
      this.input.click()
    }
  }

  handleResetPublishedHash = () => {
    this.setState({
      isLoaded: false
    })
    this.props.input.onChange('')
  }

  renderIcon () {
    const {isLoaded, isLoading} = this.state
    return (
      <div styleName='iconWrapper'>
        {isLoading
          ? (
            <div styleName='spinner'>
              <CircularProgress size={18} thickness={1.5}/>
            </div>
          )
          : (
            <div styleName='icon'>
              <IconButton
                onTouchTap={isLoaded ? this.handleResetPublishedHash : this.handleOpenFileDialog}
              >
                {isLoaded ? <NavigationClose /> : <EditorAttachFile />}
              </IconButton>
            </div>
          )}
      </div>
    )
  }

  getError () {
    const errorToken = this.state.error
    if (errorToken) {
      return <Translate value={errorToken}/>
    }

    const {meta: {touched, error}} = this.props
    if (touched && error) {
      return error
    }

    return null
  }

  getFileList () {
    // TODO @dkchv: show it
    return null
  }

  render () {
    const {isLoading, accept} = this.state
    const {multiple, label, input} = this.props

    return (
      <div>
        <div styleName='wrapper'>
          <TextField
            onTouchTap={this.handleOpenFileDialog}
            hintText={<Translate value={isLoading ? 'forms.fileUploading' : (label || 'forms.selectFile')}/>}
            style={!isLoading ? {cursor: 'pointer'} : null}
            errorText={this.getError()}
            multiLine
            disabled={isLoading}
            fullWidth
            value={input.value}
            {...this.props.textFieldProps}
          />

          <input
            ref={(input) => this.input = input}
            type='file'
            onChange={this.handleChange}
            styleName='hide'
            multiple={multiple}
            accept={accept.join(', ')}
          />

          {this.renderIcon()}
        </div>
        {multiple && <div>Allow multiply files</div>}
        {this.getFileList()}
      </div>
    )
  }
}

export default FileSelect
