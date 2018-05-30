import { CSSTransitionGroup } from 'react-transition-group'
import Partials from 'layouts/partials'
import React, { Component } from 'react'

import './WalletPage.scss'

export default class WalletsPage extends Component {
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
          <Partials.WalletsContent />
        </CSSTransitionGroup>
      </div>
    )
  }
}
