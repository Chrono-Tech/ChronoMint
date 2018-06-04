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
  }

  render () {
    const { title, children } = this.props
    return (
      <div styleName='root' className='WidgetContainer__root'>
        {title && <div styleName='title'><Translate value={title} /></div>}
        <div styleName='body'>
          {children}
        </div>
      </div>
    )
  }
}
