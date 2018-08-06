/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { SidePanel } from 'layouts/partials'
import { DUCK_SIDES } from 'redux/sides/constants'

import './SideStack.scss'

function mapStateToProps (state) {
  return {
    stack: state.get(DUCK_SIDES).stack,
  }
}

@connect(mapStateToProps)
class SideStack extends PureComponent {
  static propTypes = {
    stack: PropTypes.objectOf(PropTypes.object),
  }

  render () {
    return (
      <div styleName='root'>
        {this.props.stack && Object.values(this.props.stack).map((panel) => {
          return (
            <SidePanel key={panel.panelKey} {...panel} />
          )
        })}
      </div>
    )
  }
}

export default SideStack
