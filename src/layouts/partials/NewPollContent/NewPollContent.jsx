/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PollEditForm from 'components/voting/PollEditForm/PollEditForm'
import React, { Component } from 'react'
import './NewPollContent.scss'

export default class NewPollContent extends Component {
  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <PollEditForm />
        </div>
      </div>
    )
  }
}
