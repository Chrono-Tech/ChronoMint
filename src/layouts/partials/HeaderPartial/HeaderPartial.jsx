/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { TopButtons } from 'components'
import { IconButton } from 'material-ui'
import { sidesPush } from 'redux/sides/actions'
import NotificationContent, { NOTIFICATION_PANEL_KEY } from 'layouts/partials/NotificationContent/NotificationContent'
import LocaleDropDown from 'layouts/partials/LocaleDropDown/LocaleDropDown'

import './HeaderPartial.scss'

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    handleNotificationTap: () => {
      dispatch(sidesPush({
        component: NotificationContent,
        panelKey: NOTIFICATION_PANEL_KEY,
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
    location: PropTypes.shape({
      action: PropTypes.string,
      hash: PropTypes.string,
      key: PropTypes.string,
      pathname: PropTypes.string,
      query: PropTypes.object,
      search: PropTypes.string,
      state: PropTypes.string,
    }),
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='actions'>
          <TopButtons location={this.props.location} />

          <LocaleDropDown />

          <div styleName='action' onTouchTap={this.props.handleNotificationTap}>
            <IconButton>
              <i className='material-icons' styleName='icon'>notifications_active</i>
            </IconButton>
          </div>

        </div>
      </div>
    )
  }

}
