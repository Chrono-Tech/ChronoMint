import FileDownload from 'material-ui/svg-icons/file/file-download'
import { FlatButton } from 'material-ui'
// TODO MINT-266 New LOC
/* eslint-disable */
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'

import ModalBase from './ModalBase/ModalBase'

const MIMETypesToShow = [
  'application/pdf;',
  'text/',
  'image/'
]

class UploadedFileModal extends PureComponent {
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
