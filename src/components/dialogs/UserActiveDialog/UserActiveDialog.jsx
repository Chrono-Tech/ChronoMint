import PropTypes from 'prop-types'
import Button from 'components/common/ui/Button/Button'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import userMonitorService from 'user/monitorService'
import { connect } from 'react-redux'
import { logout } from 'redux/session/actions'
import { modalsClose } from 'redux/modals/actions'
import ModalDialog from 'components/dialogs/ModalDialog'
import Timer from 'components/common/Timer/Timer'

import './UserActiveDialog.scss'

function mapDispatchToProps (dispatch) {
  return {
    handleLogout: () => dispatch(logout()),
    modalsClose: () => {
      userMonitorService.start()
      dispatch(modalsClose())
    },
  }
}

@connect(null, mapDispatchToProps)
export default class UserActiveDialog extends PureComponent {
  static propTypes = {
    handleLogout: PropTypes.func,
    modalsClose: PropTypes.func,
  }

  componentDidMount () {
    userMonitorService.stop()
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
      <ModalDialog>
        <div styleName='content'>
          <div styleName='dialogHeader'>
            <div styleName='dialogHeaderStuff'>
              <div styleName='dialogHeaderTitle'>
                <Translate value='UserActiveDialog.title' />
              </div>
            </div>
          </div>
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
              onTouchTap={this.handleClose}
            />
          </div>
        </div>
      </ModalDialog>
    )
  }
}
