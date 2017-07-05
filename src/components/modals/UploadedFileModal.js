// TODO MINT-266 New LOC
/* eslint-disable */
import React, { Component } from 'react'
import { FlatButton } from 'material-ui'
import FileDownload from 'material-ui/svg-icons/file/file-download'
import ModalBase from './ModalBase/ModalBase'
import { Translate } from 'react-redux-i18n'

const MIMETypesToShow = [
  'application/pdf;',
  'text/',
  'image/'
]

class UploadedFileModal extends Component {
  handleClose = () => {
    this.props.hideModal()
  }

  render () {
    const {open, data} = this.props

    const actions = [
      <FlatButton
        key='close'
        label={<Translate value='terms.close' />}
        primary
        onTouchTap={this.handleClose}
      />
    ]

    const preview = MIMETypesToShow.some((item) => data.substr('data:'.length, item.length) === item)
      ? <object data={data} style={{width: '100%', height: 500}}>
        <embed src={data} />
      </object>
      : null

    return (
      <ModalBase
        title='locs.uploadedFile'
        onClose={this.handleClose}
        actions={actions}
        open={open}
      >
        <p>Click for download: <a href={data} download='contract'><FileDownload /></a></p>
        {preview}
      </ModalBase>
    )
  }
}

export default UploadedFileModal
