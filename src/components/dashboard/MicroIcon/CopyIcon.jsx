import React from 'react'
import PropTypes from 'prop-types'

import Clipboard from 'utils/Clipboard'

import './MicroIcon.scss'

export default class CopyIcon extends React.Component {

  static propTypes = {
    value: PropTypes.node
  }

  render () {
    return (
      <div styleName='root'>
        <a styleName='micro'
          onTouchTap={() => this.handleCopy()}
        >
          <i className='material-icons'>content_copy</i>
        </a>
      </div>
    )
  }

  handleCopy () {
    Clipboard.copy(this.props.value)
  }
}
