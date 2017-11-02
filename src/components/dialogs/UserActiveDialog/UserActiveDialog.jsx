import { CSSTransitionGroup } from 'react-transition-group'
import PropTypes from 'prop-types'
import { RaisedButton } from 'material-ui'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import UserMonitorService from 'user/monitorService'
import { connect } from 'react-redux'

import { logout } from 'redux/session/actions'
import { modalsClose } from 'redux/modals/actions'

import ModalDialog from 'components/dialogs/ModalDialog'
import Timer from 'components/common/Timer/Timer'

import './UserActiveDialog.scss'

const TRANSITION_TIMEOUT = 250

function mapDispatchToProps (dispatch) {
  return {
    handleLogout: () => dispatch(logout()),
    closeModal: () => {
      UserMonitorService.start()
      dispatch(modalsClose())
    },
  }
}

@connect(null, mapDispatchToProps)
export default class UserActiveDialog extends PureComponent {
  static propTypes = {
    handleLogout: PropTypes.func,
    closeModal: PropTypes.func,
  }

  componentDidMount () {
    UserMonitorService.stop()
  }

  handleTimeEnd () {
    this.props.closeModal()
    this.props.handleLogout()
  }

  render () {
    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={TRANSITION_TIMEOUT}
        transitionEnterTimeout={TRANSITION_TIMEOUT}
        transitionLeaveTimeout={TRANSITION_TIMEOUT}
      >
        <ModalDialog onClose={() => this.props.closeModal()}>
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
              <Timer time={30} onEndTimeAction={() => this.handleTimeEnd()} />
            </div>
            <div
              styleName='dialogFooter'
            >
              <RaisedButton
                styleName='action'
                label={<Translate value='UserActiveDialog.here' />}
                type='submit'
                primary
                onClick={() => this.props.closeModal()}
              />
            </div>
          </div>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }
}
