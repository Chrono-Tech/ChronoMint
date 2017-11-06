import { Dialog, FlatButton } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { modalsClose } from 'redux/modals/actions'

@connect(null, mapDispatchToProps)
export default class AlertDialog extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    handleClose: PropTypes.func,
  }

  renderActions () {
    return [
      <FlatButton
        key='close'
        label='Close'
        primary
        onTouchTap={() => this.props.handleClose()}
      />,
    ]
  }

  render () {
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
}

function mapDispatchToProps (dispatch) {
  return {
    handleClose: () => dispatch(modalsClose()),
  }
}
