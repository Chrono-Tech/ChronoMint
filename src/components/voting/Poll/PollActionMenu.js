/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Menu, MenuItem, Popover } from 'material-ui'
import Amount from '@chronobank/core/models/Amount'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { PTPoll } from '@chronobank/core/redux/voting/types'
import { Translate } from 'react-redux-i18n'
import { prefix } from './lang'
import './PollActionMenu.scss'

export default class PollActionMenu extends PureComponent {
  static propTypes = {
    poll: PTPoll,
    timeToken: PropTypes.instanceOf(TokenModel),
    isCBE: PropTypes.bool,
    deposit: PropTypes.instanceOf(Amount),
    handlePollRemove: PropTypes.func,
    handlePollActivate: PropTypes.func,
    handlePollEnd: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      open: false,
    }
  }

  handleClick = (event) => {
    event.preventDefault()

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    })
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    })
  }

  handleItemClick = (callback) => () => {
    this.handleRequestClose()
    callback()
  }

  render () {
    const { poll, isCBE, deposit } = this.props

    return (
      <div styleName='root'>
        <div styleName='menuButton' onClick={this.handleClick}>
          <i styleName='icon' className='chronobank-icon'>more</i>
        </div>

        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
        >
          <Menu styleName='menuDropDown'>
            {isCBE && (!poll.status || !poll.active)
              ? (
                <MenuItem
                  primaryText={<Translate value={`${prefix}.remove`} />}
                  disabled={poll.isFetching}
                  onClick={this.handleItemClick(this.props.handlePollRemove)}
                />
              )
              : null
            }
            {isCBE && poll.status && poll.active
              ? (
                <MenuItem
                  primaryText={<Translate value={`${prefix}.endPoll`} />}
                  disabled={poll.isFetching}
                  onClick={this.handleItemClick(this.props.handlePollEnd)}
                />
              )
              : null
            }
            {isCBE && poll.status && !poll.active
              ? (
                <MenuItem
                  primaryText={<Translate value={`${prefix}.activate`} />}
                  disabled={poll.isFetching}
                  onClick={this.handleItemClick(this.props.handlePollActivate)}
                />
              )
              : null
            }
          </Menu>
        </Popover>
      </div>
    )
  }
}
