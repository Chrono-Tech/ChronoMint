/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { TextField } from 'redux-form-material-ui'
import Button from 'components/common/ui/Button/Button'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { modalsClose } from '@chronobank/core/redux/modals/actions'
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
    // new material-ui has no select method anymore, so we are using direct access via id
    document.getElementById('copying-address').select()
  }

  handleClose = () => {
    this.props.modalsClose()
  }

  render () {
    return (
      <ModalDialog>
        <div styleName='root'>
          <div styleName='content'>
            <div styleName='header'>
              <h3>{this.props.title}</h3>
            </div>
            <div styleName='body'>
              <div>
                {this.props.description}
              </div>
              <TextField
                id='copying-address'
                name='value'
                value={this.props.copyValue}
                fullWidth
                label={this.props.controlTitle}
              />
            </div>
            <div styleName='footer'>
              <Button
                label='Close'
                onClick={this.handleClose}
              />
            </div>
          </div>
        </div>
      </ModalDialog>
    )
  }
}

