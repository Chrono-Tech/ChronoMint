/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { getSelectedPoll } from '@chronobank/core/redux/voting/selectors'
import { Translate } from 'react-redux-i18n'
import { isCBE } from '@chronobank/core/redux/session/selectors'
import { PTPoll } from '@chronobank/core/redux/voting/types'
import Button from 'components/common/ui/Button/Button'
import { modalsOpen } from 'redux/modals/actions'
import PublishPollDialog from 'components/dialogs/PublishPollDialog/PublishPollDialog'
import './ActivatePollTopButton.scss'

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
    handlePollActivate: (poll) => dispatch(modalsOpen({
      component: PublishPollDialog,
      props: {
        poll,
      },
    })),

  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class ActivatePollTopButton extends PureComponent {
  static propTypes = {
    poll: PTPoll,
    isCBE: PropTypes.bool,
    handlePollActivate: PropTypes.func,
  }

  handlePollActivate = () => {
    this.props.handlePollActivate(this.props.poll)
  }

  render () {
    const { poll, isCBE } = this.props
    if (!poll || !isCBE || (poll.status && poll.active)) {
      return null
    }

    return (
      <Button styleName='button' label={<Translate value='topButtons.publish' />} onClick={this.handlePollActivate} />
    )
  }
}
