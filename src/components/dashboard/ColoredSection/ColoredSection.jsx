import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import './ColoredSection.scss'

class ColoredSection extends PureComponent {
  render () {
    return (
      <div styleName='root' className='ColoredSection__root'>
        { this.props.head == null ? null : (
          <div styleName='head' className='ColoredSection__head'>
            {this.props.head}
          </div>
        ) }
        { this.props.body == null ? null : (
          <div styleName='body' className='ColoredSection__body'>
            {this.props.body}
          </div>
        ) }
        { this.props.foot == null ? null : (
          <div styleName='foot' className='ColoredSection__foot'>
            {this.props.foot}
          </div>
        ) }
      </div>
    )
  }
}

ColoredSection.propTypes = {
  head: PropTypes.node,
  body: PropTypes.node,
  foot: PropTypes.node,
}


export default ColoredSection
