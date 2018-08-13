/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { CSSTransitionGroup } from 'react-transition-group'
import AssetsContent from 'layouts/partials/AssetsContent/AssetsContent'
import React, { Component } from 'react'

import './AssetsPage.scss'

export default class AssetsPage extends Component {
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
          <AssetsContent />
        </CSSTransitionGroup>
      </div>
    )
  }
}
