/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import CONFIRM_OPERATION_SVG from 'assets/img/confirm-operation.svg'
import React, { PureComponent } from 'react'
import { modalsClear, modalsClose } from '@chronobank/core/redux/modals/actions'
import ModalDialog from 'components/dialogs/ModalDialog'

import { prefix } from './lang'
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
              <h3><Translate value={`${prefix}.title`} /></h3>
            </div>
            <div styleName='icon-container'>
              <img styleName='operation-icon' src={CONFIRM_OPERATION_SVG} alt='Confirm operation on device' />
            </div>
            <div styleName='body'>
              <span styleName='confirm-text'>
                <Translate value={`${prefix}.pleaseConfirm`} />
              </span>
              <span styleName='close-text'>
                <Translate value={`${prefix}.closeAutomatically`} />
              </span>
            </div>
          </div>
        </div>
      </ModalDialog>
    )
  }
}
