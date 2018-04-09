/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import './Points.scss'

export default class Points extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
  }

  render () {
    return (
      <div styleName='root'>
        <ul>
          { this.props.children.map((child, index) => (
            <li key={index}>
              <span styleName='point'>{index + 1}</span>
              <span styleName='point-info'>
                {child}
              </span>
            </li>
          )) }
        </ul>
      </div>
    )
  }
}
