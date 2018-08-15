/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import './WidgetContainer.scss'

export default class WidgetContainer extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    blockchain: PropTypes.string,
  }

  render () {
    const { title, children, blockchain } = this.props
    return (
      <div styleName='root' className='WidgetContainer__root'>
        {title && <div styleName='title'><Translate value={title} blockchain={blockchain} /></div>}
        <div styleName='body'>
          {children}
        </div>
      </div>
    )
  }
}
