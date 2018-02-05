import PropTypes from 'prop-types'
import { RaisedButton, TextField } from 'material-ui'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { modalsClose } from 'redux/modals/actions'
import ModalDialog from '../ModalDialog'

import './CopyDialog.scss'

function mapDispatchToProps (dispatch) {
  return {
    modalsClose: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class CopyDialog extends PureComponent {
  static propTypes = {
    copyValue: PropTypes.string,
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    controlTitle: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    description: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    modalsClose: PropTypes.func,
  }

  componentDidMount () {
    this.inputElement.select()
  }

  handleClose = () => {
    this.props.modalsClose()
  }

  render () {
    return (
      <ModalDialog styleName='root'>
        <div styleName='content'>
          <div styleName='header'>
            <h3>{this.props.title}</h3>
          </div>
          <div styleName='body'>
            <div>
              {this.props.description}
            </div>
            <TextField
              ref={(el) => {
                this.inputElement = el
              }}
              name='value'
              value={this.props.copyValue}
              fullWidth
              floatingLabelText={this.props.controlTitle}
            />
          </div>
          <div styleName='footer'>
            <RaisedButton
              primary
              label='Close'
              onTouchTap={this.handleClose}
            />
          </div>
        </div>
      </ModalDialog>
    )
  }
}

