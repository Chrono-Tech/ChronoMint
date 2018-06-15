/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, TopButtons } from 'components'
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

          <Button styleName='action' onClick={this.props.handleNotificationTap}>
            <i className='material-icons'>notifications_active</i>
          </Button>
        </div>
      </div>
    )
  }

}
