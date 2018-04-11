/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import './FileIcon.scss'

export default class FileIcon extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
  }

  static defaultProps = {
    type: 'default',
  }

  render () {
    return (
      <div styleName={`icon icon-${this.props.type.toLowerCase()}`} />
    )
  }
}
