/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSelectedPoll, getVotingFlags } from '@chronobank/core/redux/voting/selectors'
import { initAssetsHolder } from '@chronobank/core/redux/assetsHolder/actions'
import { listPolls } from '@chronobank/core/redux/voting/actions'
import { isCBE } from '@chronobank/core/redux/session/selectors'
import { getDepositAmount } from '@chronobank/core/redux/assetsHolder/selectors'
import { PTPoll } from '@chronobank/core/redux/voting/types'
import { push } from 'react-router-redux'

import './PollContent.scss'

function makeMapStateToProps () {
  const getPoll = getSelectedPoll()
  const getIsCBE = isCBE()
  const getFlags = getVotingFlags()
  const getDeposit = getDepositAmount()

  const mapStateToProps = (ownState) => {
    return {
      poll: getPoll(ownState),
      deposit: getDeposit(ownState),
      isCBE: getIsCBE(ownState),
      ...getFlags(ownState),
    }
  }
  return mapStateToProps
}

function mapDispatchToProps (dispatch) {
  return {
    getList: () => dispatch(listPolls()),
    initAssetsHolder: () => dispatch(initAssetsHolder()),
  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class PollContent extends Component {
  static propTypes = {
    poll: PTPoll,
  }

  componentDidMount () {
    if (!this.props.poll) {
      push('/voting')
    }
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
        </div>
      </div>
    )
  }
}
