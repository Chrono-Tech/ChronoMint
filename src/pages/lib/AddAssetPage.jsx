/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { CSSTransitionGroup } from 'react-transition-group'
import AddAssetContent from 'layouts/partials/AddAssetContent/AddAssetContent'
import React, { Component } from 'react'

import './WalletPage.scss'

export default class AssetPage extends Component {
  render () {
    console.log('AssetPage: ', this.props)

    return (
      <div styleName='root'>
        <CSSTransitionGroup
          transitionName='transition-opacity'
          transitionAppear
          transitionAppearTimeout={250}
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}
        >
          <AddAssetContent />
        </CSSTransitionGroup>
      </div>
    )
  }
}
