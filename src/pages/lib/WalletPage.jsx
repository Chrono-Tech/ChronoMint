import { CSSTransitionGroup } from 'react-transition-group'
import Partials from 'layouts/partials'
import React, { Component } from 'react'

import './WalletPage.scss'

export default class WalletPage extends Component {
  render () {
    return (
      <div styleName='root'>
        <Partials.BrandPartial />
        <CSSTransitionGroup
          transitionName='transition-opacity'
          transitionAppear
          transitionAppearTimeout={250}
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}
        >
          <Partials.InfoPartial />
          <Partials.WalletContent />
        </CSSTransitionGroup>
        { !window.isMobile && <Partials.FooterPartial /> }
      </div>
    )
  }
}

