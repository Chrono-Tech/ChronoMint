/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import SideSelector from './SideSelector'
import {
  DUCK_SIDES,
} from 'redux/sides/constants'

import './SideStack.scss'

const mapStateToProps = (state) => ({
  stack: state.get(DUCK_SIDES).stack,
})

@connect(mapStateToProps)
export default class SideStack extends PureComponent {
  static propTypes = {
    stack: PropTypes.objectOf(PropTypes.object),
  }

  render () {
    return (
      <div styleName='root'>
        {
          this.props.stack && Object.values(this.props.stack)
            .map((panel) => <SideSelector key={panel.panelKey} {...panel} />)
        }
      </div>
    )
  }
}
