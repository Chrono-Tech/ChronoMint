import React from 'react'
import ReactDOM from 'react-dom'
import RaisedButton from 'material-ui/RaisedButton'

const propTypes = {
  accept: React.PropTypes.string,
  label: React.PropTypes.any,
  multi: React.PropTypes.bool,
  onUpload: React.PropTypes.func.isRequired,
  passBase64: React.PropTypes.bool
}

const defaultProps = {
  label: 'Upload Contract',
  multi: false,
  accept: null,
  passBase64: false
}

export default class Component extends React.Component {
  openFileDialog () {
    const fileInputDom = ReactDOM.findDOMNode(this.refs.input)
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
          onClick={this.openFileDialog.bind(this)} />
        <input
          type='file'
          multiple={this.props.multi}
          ref='input'
          style={{display: 'none'}}
          accept={this.props.accept}
          onChange={this.handleFile.bind(this)} />
      </div>
    )
  }
}

Component.propTypes = propTypes
Component.defaultProps = defaultProps
