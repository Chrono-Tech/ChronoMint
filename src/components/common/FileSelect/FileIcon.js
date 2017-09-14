import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './FileIcon.scss'

export default class FileIcon extends Component {

  static propTypes = {
    type: PropTypes.string
  }

  static defaultProps = {
    type: 'default'
  }

  render () {
    return (
      <div styleName={`icon icon-${this.props.type.toLowerCase()}`}></div>
    )
  }
}
