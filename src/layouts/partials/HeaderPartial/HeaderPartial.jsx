import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { IconButton, FontIcon } from 'material-ui'
import { sidesPush } from 'redux/sides/actions'
import NotificationContent, { PANEL_KEY } from 'layouts/partials/NotificationContent/NotificationContent'

import './HeaderPartial.scss'

function mapStateToProps (state) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleNotificationTap: () => {
      dispatch(sidesPush({
        component: NotificationContent,
        panelKey: PANEL_KEY,
        isOpened: true,
        direction: 'right',
      }))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class HeaderPartial extends PureComponent {
  static propTypes = {
    handleNotificationTap: PropTypes.func,
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='action-list'>
          <div styleName='notification' onTouchTap={this.props.handleNotificationTap}>
            <IconButton>
              <FontIcon className='material-icons'>notifications_active</FontIcon>
            </IconButton>
          </div>
        </div>
      </div>
    )
  }

}
