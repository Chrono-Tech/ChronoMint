/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import './IconSection.scss'

class IconSection extends PureComponent {
  static propTypes = {
    title: PropTypes.node,
    icon: PropTypes.string,
    iconComponent: PropTypes.node,
    children: PropTypes.node,
  }

  static defaultProps = {
    title: 'Default Title',
    icon: null,
    children: null,
  }

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='col'>
          <div styleName='left'>
            <div styleName='top'>
              <h3>{this.props.title}</h3>
            </div>
            <div styleName='bottom'>
              {this.props.children}
            </div>
          </div>
        </div>
        <div styleName='iconCol'>
          <div styleName='right'>
            <div className='icon'>
              {this.props.iconComponent != null
                ? (this.props.iconComponent)
                : (<div className='content' style={{ backgroundImage: `url("${this.props.icon}")` }} />)
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default IconSection
