/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import SideSelector from './SideSelector'
import { initSidesStack } from 'redux/sides/actions'
import {
  MENU_ASSETS_MANAGER_PANEL_KEY,
  NOTIFICATION_PANEL_KEY,
  PROFILE_SIDE_PANEL_KEY,
  DUCK_SIDES,
} from 'redux/sides/constants'

import './SideStack.scss'

const mapStateToProps = (state) => ({
  stack: state.get(DUCK_SIDES).stack,
})

const mapDispatchToProps = (dispatch) => ({
  initSidesStack: (stack) => dispatch(initSidesStack(stack)),

})

const initialSidesStack = {
  [PROFILE_SIDE_PANEL_KEY]: {
    componentName: 'ProfileContent',
    panelKey: PROFILE_SIDE_PANEL_KEY,
    isOpened: false,
    direction: 'right',
    drawerProps: {
      width: 300,
    },
  },
  [NOTIFICATION_PANEL_KEY]: {
    componentName: 'NotificationContent',
    panelKey: NOTIFICATION_PANEL_KEY,
    isOpened: false,
    anchor: 'right',
  },
  [MENU_ASSETS_MANAGER_PANEL_KEY]: {
    componentName: 'MenuAssetsManagerMoreInfo',
    panelKey: MENU_ASSETS_MANAGER_PANEL_KEY,
    isOpened: false,
    anchor: 'left',
  },
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SideStack extends PureComponent {
  static propTypes = {
    stack: PropTypes.objectOf(PropTypes.object),
  }

  componentWillMount () {
    this.props.initSidesStack(initialSidesStack)
  }

  render () {
    return (
      <div styleName='root'>
        {
          this.props.stack && Object.values(this.props.stack)
            .map((panel) => <SideSelector key={panel.panelKey} {...panel}/> )
        }
      </div>
    )
  }
}
