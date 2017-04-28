import React, { Component } from 'react'
import { Dialog, FlatButton } from 'material-ui'
import IconButton from 'material-ui/IconButton'
import globalStyles from '../../styles'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import FileDownload from 'material-ui/svg-icons/file/file-download'

class UploadedFileModal extends Component {
  handleClose = () => {
    this.props.hideModal()
  }

  MIMETypesToShow = ['application/pdf;', 'text/', 'image/']

  render () {
    const {open, data} = this.props

    const actions = [
      <FlatButton
        label='Close'
        style={globalStyles.flatButton}
        labelStyle={globalStyles.flatButtonLabel}
        primary
        onTouchTap={this.handleClose}
      />
    ]

    const title = <div>
      Uploaded File
      <IconButton style={{float: 'right', margin: '-12px -12px 0px'}} onTouchTap={this.handleClose}>
        <NavigationClose />
      </IconButton>
    </div>

    const preview = this.MIMETypesToShow.some((item) => data.substr('data:'.length, item.length) === item)
      ? <object data={data} style={{width: '100%', height: 500}}>
        <embed src={data}/>
      </object>
      : null

    return (
      <Dialog
        title={title}
        actions={actions}
        actionsContainerStyle={{padding: 26}}
        titleStyle={{paddingBottom: 10}}
        modal
        open={open}>
        <p>Click for download: <a href={data} download='contract'><FileDownload /></a></p>
        {preview}
      </Dialog>
    )
  }
}

export default UploadedFileModal
