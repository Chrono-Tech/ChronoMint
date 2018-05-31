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
  }

  static defaultProps = {
    avatar: '/src/assets/img/profile-photo-1.jpg',
    name: '',
    address: '',
    onClick: () => {},
    hideActionIcon: false,
    actionIcon: '/src/assets/img/icons/list.svg',
    actionIconClass: '',
  }

  render () {
    const {
      handleSubmit,
      error,
      pristine,
      invalid,
      avatar,
      actionIcon,
      actionIconClass,
      hideActionIcon,
      title,
      subtitle,
      onClick,
    } = this.props

    return (
      <div className={[css.userBlock, onClick ? '' : css.userBlockSingle ].join(' ')} onClick={onClick ? onClick : () => {}}>
        <div className={css.userBlockInner}>
          <div className={css.userBlockAvatar}>
            <img className={css.userAvatar} src={avatar} alt='' />
          </div>
          <div className={css.userBlockInfo}>
            { title ? (
              <div className={[css.title].join(' ')}>
                {title}
              </div>) : null}
            { subtitle ? (
              <div className={[css.subtitle].join(' ')}>
                {subtitle}
              </div>) : null}
          </div>
        </div>
        { !hideActionIcon ? (
          <div className={css.actionWrapper}>
            <span className={[css.actionListTrigger, onClick ? '' : css.actionListTriggerDisabled].join(' ')}>
              <img className={actionIconClass} src={actionIcon} alt='' />
            </span>
          </div>
        ) : null}
      </div>
    )
  }
}
