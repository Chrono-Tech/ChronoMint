/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { CSSTransitionGroup } from 'react-transition-group'
import VotingContent from 'layouts/partials/VotingContent/VotingContent'
import React, { Component } from 'react'

import './VotingPage.scss'

export default class VotingPage extends Component {
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
          <VotingContent />
        </CSSTransitionGroup>
      </div>
    )
  }
}
