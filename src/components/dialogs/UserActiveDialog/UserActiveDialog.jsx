/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import Button from 'components/common/ui/Button/Button'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import userMonitorService from '@chronobank/login-ui/redux/userMonitorService'
import { connect } from 'react-redux'
import { logoutAndNavigateToRoot } from 'redux/ui/thunks'
import { modalsClose } from '@chronobank/core/redux/modals/actions'
import { stopUserMonitor } from '@chronobank/login-ui/redux/thunks'
import ModalDialog from 'components/dialogs/ModalDialog'
import Timer from 'components/common/Timer/Timer'

import './UserActiveDialog.scss'

function mapDispatchToProps (dispatch) {
  return {
    handleLogout: () => dispatch(logoutAndNavigateToRoot()),
    modalsClose: () => {
      userMonitorService.start()
      dispatch(modalsClose())
    },
    stopUserMonitor: () => dispatch(stopUserMonitor()),
  }
}

@connect(null, mapDispatchToProps)
export default class UserActiveDialog extends PureComponent {
  static propTypes = {
    handleLogout: PropTypes.func,
    modalsClose: PropTypes.func,
    stopUserMonitor: PropTypes.func,
  }

  componentDidMount () {
    this.props.stopUserMonitor()
  }

  handleTimeEnd = () => {
    this.handleClose()
    this.props.handleLogout()
  }

  handleClose = () => {
    this.props.modalsClose()
  }

  render () {
    return (
      <ModalDialog title={<Translate value='UserActiveDialog.title' />} hideCloseIcon>
        <div styleName='content'>
          <div styleName='dialogBody'>
            <Translate value='UserActiveDialog.text' />
            <Timer
              time={30}
              onEndTimeAction={this.handleTimeEnd}
            />
          </div>
          <div styleName='dialogFooter'>
            <Button
              styleName='action'
              label={<Translate value='UserActiveDialog.here' />}
              type='submit'
              onClick={this.handleClose}
            />
          </div>
        </div>
      </ModalDialog>
    )
  }
}
