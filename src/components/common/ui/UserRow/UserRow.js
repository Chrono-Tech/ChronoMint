import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'react-router'

import DEFAULT_AVATAR from 'assets/img/profile-photo-1.jpg'
import actionIcon from 'assets/img/icons/list.svg'

import css from './UserRow.scss'

export default class UserRow extends React.Component {
  static propTypes = {
    avatar: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.string,
    onClick: PropTypes.func,
    hideActionIcon: PropTypes.bool,
    actionIcon: PropTypes.string,
    actionIconClass: PropTypes.string,
    linkTitle: PropTypes.string,
    reverseIcon: PropTypes.bool,
  }

  static defaultProps = {
    avatar: DEFAULT_AVATAR,
    name: '',
    address: '',
    onClick: () => {},
    hideActionIcon: false,
    actionIcon: actionIcon,
    actionIconClass: '',
    linkTitle: '',
    reverseIcon: false,
  }

  render () {
    const {
      handleSubmit,
      error,
      pristine,
      invalid,
      avatar,
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
            <img styleName={classnames('userAvatar')} src={avatar || DEFAULT_AVATAR} alt='' />
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
