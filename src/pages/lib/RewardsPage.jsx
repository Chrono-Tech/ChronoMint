import React, { Component } from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import Partials from 'layouts/partials'
import './RewardsPage.scss'

export default class RewardsPage extends Component {

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
            <Partials.RewardsContent />
        </CSSTransitionGroup>
        <Partials.FooterPartial />
      </div>
    )
  }
}
