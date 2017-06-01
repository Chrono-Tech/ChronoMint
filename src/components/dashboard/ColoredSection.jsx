import React from 'react'
import PropTypes from 'prop-types'

import './ColoredSection.scss'

class ColoredSection extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName="root">
        { this.props.head == null ? null : (
          <div styleName="head" style={this.props.headStyle}>
            {this.props.head}
          </div>
        ) }
        { this.props.body == null ? null : (
          <div styleName="body" style={this.props.bodyStyle}>
            {this.props.body}
          </div>
        ) }
        { this.props.foot == null ? null : (
          <div styleName="foot" style={this.props.footStyle}>
            {this.props.foot}
          </div>
        ) }
      </div>
    )
  }
}

ColoredSection.propTypes = {
  head: PropTypes.element,
  headStyle: PropTypes.object,
  body: PropTypes.element,
  bodyStyle: PropTypes.object,
  foot: PropTypes.element,
  footStyle: PropTypes.object,
}


export default ColoredSection
