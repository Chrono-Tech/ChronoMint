/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Menu, MenuItem, Popover } from '@material-ui/core'
import Amount from '@chronobank/core/models/Amount'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { PTPoll } from '@chronobank/core/redux/voting/types'
import { Translate } from 'react-redux-i18n'
import { prefix } from './lang'
import styles from './PollActionMenu.scss'

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
    const { poll, isCBE } = this.props
    const showRemove = isCBE && (!poll.status || !poll.active)
    const showEnd = isCBE && poll.status && poll.active
    const showActivate = isCBE && poll.status && !poll.active

    if (!showActivate && !showEnd && !showRemove) {
      return null
    }

    return (
      <div styleName='root'>
        <button styleName='menuButton' onClick={this.handleClick}>
          <i styleName='icon' className='chronobank-icon'>more</i>
        </button>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          onClose={this.handleRequestClose}
        >
          <Menu
            classes={{
              paper: styles.menuDropDown,
            }}
            anchorEl={this.state.anchorEl}
            styleName='menuDropDown'
            open={this.state.open}
            onClose={this.handleRequestClose}
          >
            {showRemove
              ? (
                <MenuItem
                  disabled={poll.isFetching}
                  onClick={this.handleItemClick(this.props.handlePollRemove)}
                >
                  <Translate value={`${prefix}.remove`} />
                </MenuItem>
              )
              : null
            }
            {showEnd
              ? (
                <MenuItem
                  disabled={poll.isFetching}
                  onClick={this.handleItemClick(this.props.handlePollEnd)}
                >
                  <Translate value={`${prefix}.endPoll`} />
                </MenuItem>
              )
              : null
            }
            {showActivate
              ? (
                <MenuItem
                  disabled={poll.isFetching}
                  onClick={this.handleItemClick(this.props.handlePollActivate)}
                >
                  <Translate value={`${prefix}.activate`} />
                </MenuItem>
              )
              : null
            }
          </Menu>
        </Popover>
      </div>
    )
  }
}
