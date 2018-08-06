/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'react-router'
import actionIcon from 'assets/img/icons/list.svg'
import './UserRow.scss'

export default class UserRow extends React.Component {
  static propTypes = {
    avatar: PropTypes.string,
    onClick: PropTypes.func,
    hideActionIcon: PropTypes.bool,
    actionIcon: PropTypes.string,
    linkTitle: PropTypes.string,
    reverseIcon: PropTypes.bool,
  }

  static defaultProps = {
    avatar: '',
    name: '',
    address: '',
    onClick: null,
    hideActionIcon: false,
    actionIcon: actionIcon,
    actionIconClass: '',
    linkTitle: '',
    reverseIcon: false,
  }

  renderDefaultAvatar(){
    return (
      <div styleName='default-avatar-wrapper'>
        <span styleName='default-avatar' className='chronobank-icon'>
          profile-circle
        </span>
      </div>
    )
  }

  renderAvatar(){
    const { avatar } = this.props

    if (!avatar){
      return this.renderDefaultAvatar()
    }

    return (
      <img styleName='userAvatar' src={avatar} alt='' />
    )
  }

  render () {
    const {
      actionIcon,
      hideActionIcon,
      title,
      subtitle,
      linkTitle,
      onClick,
      reverseIcon,
    } = this.props

    return (
      <div styleName={classnames('userBlock', onClick ? '' : 'userBlockSingle')} onClick={onClick ? onClick : () => {}}>
        <div styleName={classnames('userBlockInner')}>
          <div styleName={classnames('userBlockAvatar')}>
            { this.renderAvatar() }
          </div>
          <div styleName={classnames('userBlockInfo')}>
            { title ? (
              <div styleName={classnames('title')}>
                {title}
              </div>) : null}
            { subtitle ? (
              <div styleName={classnames('subtitle')}>
                {subtitle}
              </div>) : null}
          </div>
        </div>
        { !hideActionIcon ? (
          <div styleName={classnames('actionWrapper')}>
            <Link
              styleName={classnames('actionListTrigger', onClick ? '' : 'actionListTriggerDisabled')}
              onClick={onClick ? onClick : () => {}}
              title={linkTitle}
            >
              <img styleName={classnames(reverseIcon ? 'reverseIcon' : '')} src={actionIcon} alt='' />
            </Link>
          </div>
        ) : null}
      </div>
    )
  }
}
