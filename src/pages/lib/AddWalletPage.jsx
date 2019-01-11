/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { CSSTransitionGroup } from 'react-transition-group'
import AddWalletContent from 'layouts/partials/AddWalletContent/AddWalletContent'
import React, { Component } from 'react'

import './WalletPage.scss'

export default class WalletPage extends Component {
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
          <AddWalletContent />
        </CSSTransitionGroup>
      </div>
    )
  }
}
