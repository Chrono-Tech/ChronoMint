/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import Button from 'components/common/ui/Button/Button'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import { modalsClose } from '@chronobank/core/redux/modals/actions'
import { PTPoll } from '@chronobank/core/redux/voting/types'
import { activatePoll } from '@chronobank/core/redux/voting/thunks'
import ModalDialog from '../ModalDialog'
import './PublishPollDialog.scss'
import { prefix } from './lang'

function mapDispatchToProps (dispatch) {
  return {
    handleModalsClose: () => dispatch(modalsClose()),
    handlePollActivate: (poll) => dispatch(activatePoll(poll)),
  }
}

@connect(null, mapDispatchToProps)
export default class PublishPollDialog extends PureComponent {
  static propTypes = {
    poll: PTPoll.isRequired,
    handleModalsClose: PropTypes.func,
    handlePollActivate: PropTypes.func,
  }

  handlePollActivate = () => {
    this.props.handleModalsClose()
    this.props.handlePollActivate(this.props.poll)
  }

  render () {
    const { poll } = this.props

    return (
      <ModalDialog styleName='root' title={<Translate value={`${prefix}.title`} />} hideCloseIcon>
        <div styleName='content'>
          <Translate value={`${prefix}.text`} name={poll.title} />
          <div styleName='actionsWrapper'>
            <Button flat label={<Translate value={`${prefix}.cancel`} />} onClick={this.props.handleModalsClose} />
            <Button label={<Translate value={`${prefix}.confirm`} />} onClick={this.handlePollActivate} />
          </div>
        </div>
      </ModalDialog>
    )
  }
}
