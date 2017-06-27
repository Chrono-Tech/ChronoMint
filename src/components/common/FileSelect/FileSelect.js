import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CircularProgress, IconButton, TextField } from 'material-ui'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import EditorAttachFile from 'material-ui/svg-icons/editor/attach-file'
import IPFS from '../../../utils/IPFS'
import { Translate } from 'react-redux-i18n'
import './FileSelect.scss'

// presets
const ACCEPT_DOCS = 'application/pdf, text/*, image/*, .doc, .docx'

class FileSelect extends Component {
  static propTypes = {
    value: PropTypes.string,
    textFieldProps: PropTypes.object,
    meta: PropTypes.object,
    accept: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      isLoading: false,
      isLoaded: false,
      error: null,
      value: props.value || '',
      accept: props.accept || ACCEPT_DOCS
    }
  }

  componentWillMount () {
    this.setState({isLoaded: !!this.props.value})
  }

  handleChange = (e) => {
    const files = e.target.files
    if (!files || !files[0]) {
      return
    }

    this.setState({isLoading: true, isLoaded: false})
    const file = files[0]

    const add = (content) => {
      IPFS.getAPI().files.add([{
        path: `/${file.name}`,
        content
      }], (err, res) => {
        this.setState({isLoading: false})
        if (err) {
          this.setState({error: 'errors.fileUploadingError'})
          throw err
        }
        if (!res.length) {
          // TODO @dkchv: add error
          return
        }
        this.setState({
          isLoaded: true,
          value: res[0].hash
        })
      })
    }

    if (file.path) {
      add(file.path)
    } else {
      const reader = new window.FileReader()
      reader.onload = () => {
        let data = reader.result
        add(data)
      }
      // TODO: use array buffers instead of base64 strings
      reader.readAsDataURL(file)
    }
  }

  handleOpenFileDialog = () => {
    if (!this.state.isLoading) {
      this.input.click()
    }
  }

  handleResetPublishedHash = () => {
    this.setState({
      value: '',
      isLoaded: false
    })
  }

  renderIcon () {
    const {isLoaded, isLoading} = this.state
    return (
      <div styleName='iconWrapper'>
        {isLoading
          ? (
            <div styleName='spinner'>
              <CircularProgress size={18} thickness={1.5} />
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
      return <Translate value={errorToken} />
    }

    const {meta: {touched, error}} = this.props
    if (touched && error) {
      return error
    }

    return null
  }

  render () {
    const {isLoading, value} = this.state

    return (
      <div styleName='wrapper'>
        <TextField
          onTouchTap={this.handleOpenFileDialog}
          hintText={<Translate value={isLoading ? 'forms.fileUploading' : 'forms.selectFile'} />}
          style={!isLoading ? {cursor: 'pointer'} : null}
          errorText={this.getError()}
          multiLine
          disabled={isLoading}
          fullWidth
          value={value}
          {...this.props.textFieldProps}
        />

        <input
          ref={(input) => this.input = input}
          type='file'
          onChange={this.handleChange}
          styleName='hide'
          accept={this.props.accept}
        />

        {this.renderIcon()}
      </div>

    )
  }
}

export default FileSelect