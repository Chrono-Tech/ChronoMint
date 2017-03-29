import React, {Component} from 'react'
import {Dialog, FlatButton} from 'material-ui'
import IconButton from 'material-ui/IconButton'
import globalStyles from '../../styles'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

class UploadedFileModal extends Component {
  handleClose = () => {
    this.props.hideModal()
  };

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
      Uploaded File:
      <IconButton style={{float: 'right', margin: '-12px -12px 0px'}} onTouchTap={this.handleClose}>
        <NavigationClose />
      </IconButton>
    </div>

    return (
      <Dialog
        title={title}
        actions={actions}
        actionsContainerStyle={{padding: 26}}
        titleStyle={{paddingBottom: 10}}
        modal
        open={open}>
        <object data={data} style={{width: '100%', height: 600}}>
          <embed src={data} />
        </object>
      </Dialog>
    )
  }
}

export default UploadedFileModal
