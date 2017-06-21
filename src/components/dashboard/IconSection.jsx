import React from 'react'
import PropTypes from 'prop-types'

import './IconSection.scss'

class IconSection extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    children: PropTypes.node,
  }

  static defaultProps = {
    title: 'Default Title',
    icon: null,
    children: null
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName="root">
        <div styleName="col">
          <div styleName="left">
            <div styleName="top">
              <h3>{this.props.title}</h3>
            </div>
            <div styleName="bottom">
              {this.props.children}
            </div>
          </div>
        </div>
        <div styleName="col">
          <div styleName="right">
            <div className="icon">
              <div className="content" style={{ backgroundImage: `url("${this.props.icon}")` }}>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default IconSection
