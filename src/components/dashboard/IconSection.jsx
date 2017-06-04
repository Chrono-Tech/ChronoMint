import React from 'react'
import PropTypes from 'prop-types'

import './IconSection.scss'

class IconSection extends React.Component {

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
            <div styleName="icon">
              <div className="content">
                {this.props.icon}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

IconSection.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.element,
  children: PropTypes.node,
}

IconSection.defaultProps = {
  title: 'Default Title',
  icon: null,
  children: null
}

export default IconSection
