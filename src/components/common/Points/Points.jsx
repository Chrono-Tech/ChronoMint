import PropTypes from 'prop-types'
import React from 'react'

import './Points.scss'

export default class Points extends React.Component {
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
