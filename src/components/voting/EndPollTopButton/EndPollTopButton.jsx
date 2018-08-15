/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { getSelectedPoll } from '@chronobank/core/redux/voting/selectors'
import { Translate } from 'react-redux-i18n'
import { endPoll } from '@chronobank/core/redux/voting/actions'
import { isCBE } from '@chronobank/core/redux/session/selectors'
import { PTPoll } from '@chronobank/core/redux/voting/types'
import Button from 'components/common/ui/Button/Button'
import './EndPollTopButton.scss'

function makeMapStateToProps () {
  const getPoll = getSelectedPoll()
  const getIsCBE = isCBE()

  const mapStateToProps = (ownState) => {
    return {
      poll: getPoll(ownState),
      isCBE: getIsCBE(ownState),
    }
  }
  return mapStateToProps
}

function mapDispatchToProps (dispatch) {
  return {
    handlePollEnd: (poll) => dispatch(endPoll(poll)),
  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class EndPollTopButton extends PureComponent {
  static propTypes = {
    poll: PTPoll,
    isCBE: PropTypes.bool,
    handlePollEnd: PropTypes.func,
  }

  handlePollEnd = () => {
    this.props.handlePollEnd(this.props.poll)
  }

  render () {
    const { poll, isCBE } = this.props
    if (!poll || !isCBE || !poll.status || !poll.active) {
      return null
    }

    return (
      <Button styleName='button' label={<Translate value='topButtons.endPoll' />} onClick={this.handlePollEnd} />
    )
  }
}
