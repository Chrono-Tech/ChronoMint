/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { CSSTransitionGroup } from 'react-transition-group'
import MiningContent from 'layouts/partials/MiningContent/MiningContent'
import React, { PureComponent } from 'react'

import './DepositsPage.scss'

export default class DepositsPage extends PureComponent {
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
          <MiningContent />
        </CSSTransitionGroup>
      </div>
    )
  }
}
