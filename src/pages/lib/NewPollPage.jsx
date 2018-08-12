/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { CSSTransitionGroup } from 'react-transition-group'
import { NewPollContent } from 'layouts/partials'
import React, { Component } from 'react'

export default class NewPollPage extends Component {
  render () {
    return (
      <div>
        <CSSTransitionGroup
          transitionName='transition-opacity'
          transitionAppear
          transitionAppearTimeout={250}
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}
        >
          <NewPollContent />
        </CSSTransitionGroup>
      </div>
    )
  }
}
