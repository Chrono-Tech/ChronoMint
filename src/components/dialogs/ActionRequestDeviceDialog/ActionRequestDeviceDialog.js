/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import Button from 'components/common/ui/Button/Button'
import { modalsClear, modalsClose } from 'redux/modals/actions'
import ModalDialog from 'components/dialogs/ModalDialog'

import './ActionRequestDeviceDialog.scss'

function mapDispatchToProps (dispatch) {
  return {
    modalsClear: () => dispatch(modalsClear()),
    modalsClose: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class ActionRequestDeviceDialog extends PureComponent {
  static propTypes = {
    modalsClear: PropTypes.func.isRequired,
    modalsClose: PropTypes.func.isRequired,
  }

  render () {

    return (
      <ModalDialog>
        <div styleName='root'>
          <div styleName='content'>
            <div styleName='header'>
              <h3>{'Action required'}</h3>
            </div>
            <div styleName='body'>
              <div>
                {''}
              </div>
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
