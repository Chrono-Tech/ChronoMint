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
