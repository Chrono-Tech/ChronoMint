/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { getSelectedPoll } from '@chronobank/core/redux/voting/selectors'
import { removePoll } from '@chronobank/core/redux/voting/actions'
import { isCBE } from '@chronobank/core/redux/session/selectors'
import { PTPoll } from '@chronobank/core/redux/voting/types'
import Button from 'components/common/ui/Button/Button'
import './RemovePollTopButton.scss'

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
    handlePollRemove: (poll) => dispatch(removePoll(poll)),
  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class RemovePollTopButton extends PureComponent {
  static propTypes = {
    poll: PTPoll,
    isCBE: PropTypes.bool,
    handlePollRemove: PropTypes.func,
  }
  handlePollRemove = () => {
    this.props.handlePollRemove(this.props.poll)
  }

  render () {
    const { poll, isCBE } = this.props
    if (!poll || !isCBE || (poll.status && poll.active)) {
      return null
    }

    return (
      <Button styleName='iconButton' onClick={this.handlePollRemove}>
        <i className='chronobank-icon'>delete</i>
      </Button>
    )
  }
}
