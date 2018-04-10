/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import cx from 'classnames'
import { colorFromString } from './utils'

function stateFromProps (props) {
  const account = props.account.toUpperCase()
  return {
    style: {
      color: colorFromString(account, 3),
    },
  }
}

class UserIcon extends PureComponent {
  static propTypes = {
    styleName: PropTypes.string,
    className: PropTypes.string,
    account: PropTypes.string,
  }

  static defaultProps = {
    account: '',
    styleName: '',
  }

  constructor (props, context, updater) {
    super(props, context, updater)

    this.state = stateFromProps(props)
  }

  componentWillReceiveProps (nextProps) {
    this.setState(stateFromProps(nextProps))
  }

  render () {
    return (
      <i
        style={this.state.style}
        styleName={this.props.styleName}
        className={cx('material-icons', this.props.className)}
      >
        account_circle
      </i>
    )
  }
}

export default UserIcon
