import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'

class UploadButton extends PureComponent {
  openFileDialog () {
    // TODO Don't use ReactDOM
    // eslint-disable-next-line
    const fileInputDom = ReactDOM.findDOMNode(this.refs.fileInput)
    fileInputDom.click()
  }

  handleFile (event) {
    Object.keys(event.target.files).map((index) => {
      const file = event.target.files[index]

      if (this.props.passBase64) {
        const reader = new FileReader()
        reader.onload = (upload) => {
          const base64 = upload.target.result
          this.props.onUpload(file, base64)
        }

        reader.readAsDataURL(file)
      } else {
        this.props.onUpload(file)
      }
    })
  }

  render () {
    return (
      <div>
        <RaisedButton
          label={this.props.label}
          onClick={this.openFileDialog.bind(this)}
        />
        <input
          type='file'
          multiple={this.props.multi}
          ref={(i) => { this.fileInput = i }}
          style={{ display: 'none' }}
          accept={this.props.accept}
          onChange={this.handleFile.bind(this)}
        />
      </div>
    )
  }
}

UploadButton.propTypes = {
  accept: PropTypes.string,
  label: PropTypes.any,
  multi: PropTypes.bool,
  onUpload: PropTypes.func.isRequired,
  passBase64: PropTypes.bool,
}

UploadButton.defaultProps = {
  label: 'Upload Contract',
  multi: false,
  accept: null,
  passBase64: false,
}

export default UploadButton

