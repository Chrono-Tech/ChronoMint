/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from 'components/common/ui/Button/Button'
import PropTypes from 'prop-types'
import { getSelectedPoll, getVotingFlags } from '@chronobank/core/redux/voting/selectors'
import { initAssetsHolder } from '@chronobank/core/redux/assetsHolder/actions'
import { listPolls, vote } from '@chronobank/core/redux/voting/thunks'
import { navigateToVoting } from 'redux/ui/navigation'
import { isCBE } from '@chronobank/core/redux/session/selectors'
import { getDepositAmount } from '@chronobank/core/redux/assetsHolder/selectors'
import { PTPoll } from '@chronobank/core/redux/voting/types'
import { Translate } from 'react-redux-i18n'
import Moment from 'components/common/Moment'
import Amount from '@chronobank/core/models/Amount'
import { prefix } from './lang'

import './VoteHistoryContent.scss'

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
    handleVote: (choice) => () => {
      dispatch(vote(choice))
    },
    handleGoVotingPage: () => dispatch(navigateToVoting()),
  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class VoteHistoryContent extends Component {
  static propTypes = {
    poll: PTPoll,
    isCBE: PropTypes.bool,
    deposit: PropTypes.instanceOf(Amount),
    palette: PropTypes.arrayOf(PropTypes.string),
    handleVote: PropTypes.func,
    handleGoVotingPage: PropTypes.func,
  }

  componentDidMount () {
    if (!this.props.poll) {
      this.props.handleGoVotingPage()
    }
  }

  render () {
    const { poll } = this.props
    if (!poll) {
      return null
    }

    return (
      <div styleName='root'>
        <div styleName='head'>
          <div styleName='mainTitle'><Translate value={`${prefix}.title`} /></div>
          <div styleName='content'>
            <div styleName='pollTitle'><Translate value={`${prefix}.poll`} />{poll.title}</div>
          </div>
        </div>
        <div styleName='body'>
          <div styleName='block'>
            <div styleName='blockDate'>
              <Moment date={new Date()} />
            </div>
            <div styleName='blockContent'>
              <div styleName='blockTitle'>{poll.title}</div>
              <div styleName='blockText'>We have developed a new version of Something document and would like to know your opinion about topic on page 423.</div>
              <div styleName='blockActions'>
                <Button label={<Translate value={`${prefix}.dismissVote`} />} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
