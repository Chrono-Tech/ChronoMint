import React, { Component } from 'react'
import { CSSTransitionGroup } from 'react-transition-group'

import Partials from 'layouts/partials'

import './WalletPage.scss'

export default class WalletPage extends Component {

  render() {
    return (
      <div styleName="root">
        <Partials.BrandPartial />
        <CSSTransitionGroup
          transitionName="transition-opacity"
          transitionAppear
          transitionAppearTimeout={250}
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}>
            <Partials.WalletContent />
        </CSSTransitionGroup>
        <Partials.FooterPartial />
      </div>
    )
  }
}
