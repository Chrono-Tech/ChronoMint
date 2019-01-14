/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AssetsContent from 'layouts/partials/AssetsContent/AssetsContent'
import React, { Component } from 'react'

import './AssetsPage.scss'

export default class AssetsPage extends Component {
  render () {
    return (
      <div styleName="root">
        <AssetsContent />
      </div>
    )
  }
}
