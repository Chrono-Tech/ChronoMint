/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { CSSTransitionGroup } from 'react-transition-group'
import RewardsContent from 'layouts/partials/RewardsContent/RewardsContent'
import React, { Component } from 'react'

import './RewardsPage.scss'

export default class RewardsPage extends Component {
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
          <RewardsContent />
        </CSSTransitionGroup>
      </div>
    )
  }
}
