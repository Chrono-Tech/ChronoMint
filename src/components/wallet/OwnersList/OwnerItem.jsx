/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './OwnerItem.scss'

export default class OwnerItem extends PureComponent {
  static propTypes = {
    title: PropTypes.node, // translate node
    address: PropTypes.string,
    onRemove: PropTypes.func,
    isNoActions: PropTypes.bool,
  }

  render () {
    const { title, address, onRemove, isNoActions } = this.props

    return (
      <div styleName='root'>
        <i styleName='icon' className='material-icons'>account_circle</i>
        <div styleName='details'>
          {title && <div styleName='title'>{title}</div>}
          <div styleName='address'>{address}</div>
        </div>
        {!isNoActions && (
          <div styleName='actions'>
            <i
              styleName='action'
              className='material-icons'
              onClick={onRemove}
            >
              delete
            </i>
          </div>
        )}
      </div>
    )
  }
}
