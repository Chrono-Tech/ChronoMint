/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import VotingContent from 'layouts/partials/VotingContent/VotingContent'
import React, { Component } from 'react'

import './VotingPage.scss'

export default class VotingPage extends Component {
  render () {
    return (
      <div styleName="root">
        <VotingContent />
      </div>
    )
  }
}
