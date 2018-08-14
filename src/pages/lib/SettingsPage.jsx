/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { CSSTransitionGroup } from 'react-transition-group'
import SettingsContent from 'layouts/partials/SettingsContent/SettingsContent'
import React, { Component } from 'react'

import './SettingsPage.scss'

export default class SettingsPage extends Component {
  render () {
    return (
      <div styleName='root'>
        <CSSTransitionGroup
          transitionName='transition-opacity'
          transitionAppear
          transitionAppearTimeout={250}
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}
        >
          <SettingsContent />
        </CSSTransitionGroup>
      </div>
    )
  }
}
