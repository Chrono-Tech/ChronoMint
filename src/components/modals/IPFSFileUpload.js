import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Dialog, RaisedButton, FlatButton} from 'material-ui'
import IPFSDAO from '../../dao/IPFSDAO'

@connect(null, null)
class IPFSFileUpload extends Component {
  constructor () {
    super()
    this.state = {
      value: null,
      label: 'Choose file',
      uploadedFileHash: null
    }
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.files,
      label: e.target.files[0].name
    })
  };

  handleOpenFileDialog = () => {
    this.refs.fileUpload.click()
  };

  handleSubmit = () => {
    const files = this.state.value
    if (!files || !files[0]) return
    const file = files[0]

    const add = (data) => {
      /* global Buffer */
      IPFSDAO.node().files.add([new Buffer(data)], (err, res) => { // eslint-disable-line node/no-deprecated-api TODO fix deprecated
        if (err) {
          throw err
        }
        const hash = res[0].hash
        // TODO Dispatch upload file success
        this.setState({
          uploadedFileHash: hash
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
  };

  handleClose = () => {
    this.props.hideModal()
  };

  render () {
    const {title, open} = this.props
    const {uploadedFileHash} = this.state
    const actions = [
      <FlatButton
        label='Cancel'
        primary
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label='Submit'
        primary
        onTouchTap={this.handleSubmit}
      />
    ]

    const customContentStyle = {
      minHeight: '400px'
    }
    return (
      <Dialog
        title={title || 'Upload file to IPFS'}
        actions={actions}
        modal
        contentStyle={customContentStyle}
        open={open}>
        {
          uploadedFileHash
            ? (
              <div>
                <span>Uploaded file hash:</span>
                <br />
                <span>{uploadedFileHash}</span>
              </div>
            ) : (
              <RaisedButton
                label={this.state.label}

                primary
                onTouchTap={this.handleOpenFileDialog} />
          )
        }
        <input
          ref='fileUpload'
          type='file'
          style={{display: 'none'}}
          onChange={this.handleChange} />
      </Dialog>
    )
  }
}

export default IPFSFileUpload
