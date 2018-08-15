/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { PTPoll } from '@chronobank/core/redux/voting/types'
import { prefix } from './lang'
import './PollStatus.scss'

export default class PollStatus extends PureComponent {
  static propTypes = {
    poll: PTPoll,
  }

  render () {
    const { poll } = this.props

    if (poll.isFetching) {
      return (
        <div styleName='entryStatus'>
          <div styleName='entryBadge badgeOrange'><Translate value={`${prefix}.processing`} /></div>
        </div>
      )
    } else {
      return (
        <div styleName='entryStatus'>
          {poll.status && poll.active &&
          (<div styleName='entryBadge badgeOrange'><Translate value={`${prefix}.new`} /></div>)}

          {poll.status && !poll.active &&
          (<div styleName='entryBadge badgeBlue'><Translate value={`${prefix}.draft`} /></div>)}
        </div>
      )
    }
  }
}
