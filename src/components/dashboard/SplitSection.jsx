import React from 'react'
import PropTypes from 'prop-types'

import './SplitSection.scss'

class SplitSection extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName="root">
        <div styleName="background">
          <div styleName="background1"></div>
          <div styleName="actions">
            { this.props.left == null ? null : (
              <div styleName="left">{ this.props.left }</div>
            ) }
            { this.props.right == null ? null : (
              <div styleName="right">{ this.props.right }</div>
            ) }
          </div>
          <div styleName="background2"></div>
        </div>
        <div styleName="content">
          { this.props.head == null ? null : (
            <div styleName="head">{ this.props.head }</div>
          ) }
          <div styleName="body">
            { this.props.children }
          </div>
          { this.props.foot == null ? null : (
            <div styleName="foot">{ this.props.foot }</div>
          ) }
        </div>
      </div>
    )
  }
}

SplitSection.propTypes = {
  title: PropTypes.string,
  left: PropTypes.element,
  right: PropTypes.element,
  bottom: PropTypes.element,
}


export default SplitSection
