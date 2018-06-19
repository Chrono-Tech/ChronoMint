import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
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
    reverseIcon: PropTypes.bool,
  }

  static defaultProps = {
    avatar: '/src/assets/img/profile-photo-1.jpg',
    name: '',
    address: '',
    onClick: () => {},
    hideActionIcon: false,
    actionIcon: '/src/assets/img/icons/list.svg',
    actionIconClass: '',
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
      onClick,
      reverseIcon,
    } = this.props

    return (
      <div styleName={classnames('userBlock', onClick ? '' : 'userBlockSingle')} onClick={onClick ? onClick : () => {}}>
        <div styleName={classnames('userBlockInner')}>
          <div styleName={classnames('userBlockAvatar')}>
            <img styleName={classnames('userAvatar')} src={avatar} alt='' />
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
            <span styleName={classnames('actionListTrigger', onClick ? '' : 'actionListTriggerDisabled')}>
              <img styleName={classnames(reverseIcon ? 'reverseIcon' : '')} src={actionIcon} alt='' />
            </span>
          </div>
        ) : null}
      </div>
    )
  }
}
