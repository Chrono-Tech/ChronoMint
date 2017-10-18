import { Dialog, FlatButton } from 'material-ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { modalsClose } from 'redux/modals/actions'

import './AlertDialog.scss'

export class AlertDialog extends React.Component {
  render() {
    return (
      <Dialog
        title={this.props.title}
        actions={this.renderActions()}
        modal
        open
        onRequestClose={() => this.props.handleClose()}
      >
        {this.props.message}
      </Dialog>
    )
  }

  renderActions() {
    return [
      <FlatButton
        key='close'
        label='Close'
        primary
        onTouchTap={() => this.props.handleClose()}
      />,
    ]
  }
}

AlertDialog.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  handleClose: PropTypes.func,
}

function mapDispatchToProps(dispatch) {
  return {
    handleClose: () => dispatch(modalsClose()),
  }
}

export default connect(
  null,
  mapDispatchToProps
)(AlertDialog)
