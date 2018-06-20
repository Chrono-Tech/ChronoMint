/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { PollEditForm } from 'components'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { initAssetsHolder } from 'redux/assetsHolder/actions'
import { listPolls } from 'redux/voting/actions'
import './NewPollContent.scss'

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    getList: () => dispatch(listPolls()),
    initAssetsHolder: () => dispatch(initAssetsHolder()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class NewPollContent extends Component {
  static propTypes = {}

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
