/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Drawer from '@material-ui/core/Drawer'
import { toggleSidePanel } from 'redux/sides/actions'
import styles from './SidePanel.scss'

function mapStateToProps () {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    handlePanelClose: (panelKey: string) => dispatch(toggleSidePanel(panelKey, false)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class SidePanel extends PureComponent {

  static propTypes = {
    isOpened: PropTypes.bool,
    direction: PropTypes.oneOf(['left', 'right']),
    handlePanelClose: PropTypes.func,
    panelKey: PropTypes.string,
    component: PropTypes.func,
    componentProps: PropTypes.object,
    drawerProps: PropTypes.object,
    preCloseAction: PropTypes.func,
    className: PropTypes.string,
  }

  static defaultProps = {
    isOpened: false,
    handlePanelClose: () => {
    },
  }

  constructor (props) {
    super(props)

    this.state = {
      isReadyToClose: true,
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.isOpened && !this.props.isOpened) {
      this.setState({ isReadyToClose: false }, () => {
        setTimeout(() => {
          this.setState({ isReadyToClose: true })
        }, 300)
      })
    }
  }

  handleProfileClose = () => {
    if (!this.state.isReadyToClose) {
      return
    }
    if (typeof this.props.preCloseAction === 'function') {
      this.props.preCloseAction(this.props)
    }
    this.props.handlePanelClose(this.props.panelKey)
  }

  getDrawerProps = (componentDrawerProps) => {

    const defaultDrawerProps = {
      open: this.props.isOpened,
      variant: 'persistent',
      anchor: 'left',
    }

    return { ...defaultDrawerProps, ...componentDrawerProps }
  }

  toggleDrawer = (panelId) => () => {
    this.props.handlePanelClose(panelId)
  }

  render () {
    const Component = this.props.component
    if (!Component) {
      return null
    }

    const drawerProps = this.getDrawerProps(this.props.drawerProps)
    return (
      <Drawer
        {...drawerProps}
        onClose={this.toggleDrawer(this.props.panelKey)}
        PaperProps={{ className: styles[this.props.className || 'left'] }}
      >
        <Component onProfileClose={this.handleProfileClose} {...this.props.componentProps} />
      </Drawer>
    )
  }
}

export default SidePanel
