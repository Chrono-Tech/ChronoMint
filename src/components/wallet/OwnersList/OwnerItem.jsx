import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './OwnerItem.scss'

export default class OwnerItem extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    address: PropTypes.string.required,
    onRemove: PropTypes.func,
    isNoActions: PropTypes.bool,
  }

  render () {
    const { title, address, onRemove, isNoActions } = this.props

    return (
      <div styleName='root'>
        <div styleName='icon' className='material-icons'>account_circle</div>
        <div styleName='details'>
          {title && <div styleName='title'>{title}</div>}
          <div styleName='address'>{address}</div>
        </div>
        {!isNoActions && (
          <div styleName='actions'>
            <div
              styleName='action'
              className='material-icons'
              onTouchTap={onRemove}
            >
              delete
            </div>
          </div>
        )}
      </div>
    )
  }
}
