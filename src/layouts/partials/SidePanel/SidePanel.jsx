import { connect } from "react-redux"
import PropTypes from "prop-types"
import React, { PureComponent } from 'react'
import { Drawer } from 'material-ui'
import { SIDES_TOGGLE } from 'redux/sides/actions'

function mapStateToProps () {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    handlePanelClose: (panelKey: string) => dispatch({ type: SIDES_TOGGLE, panelKey: panelKey, isOpened: false }),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class SidePanel extends PureComponent {

  static propTypes = {
    isOpened: PropTypes.bool,
    direction: PropTypes.oneOf([ 'left', 'right' ]),
    handlePanelClose: PropTypes.func,
    panelKey: PropTypes.string,
    component: PropTypes.func,
    componentProps: PropTypes.object,
    drawerProps: PropTypes.object,
    preCloseAction: PropTypes.func,
  }

  static defaultProps = {
    isOpened: false,
    handlePanelClose: () => {
    },
  }

  constructor (props) {
    super(props)

    this.state = { isReadyToClose: true }
  }

  // Due to material-ui bug. Immediate close on mobile devices.
  // @see https://github.com/mui-org/material-ui/issues/6634
  // Going to be fixed in 1.00 version.
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
      openSecondary: this.props.direction === 'right',
      open: this.props.isOpened,
      onRequestChange: this.handleProfileClose,
      containerStyle: { width: '360px' },
      disableSwipeToOpen: true,
      width: 360,
      docked: false,
    }

    return { ...defaultDrawerProps, ...componentDrawerProps }
  }

  render () {
    const Component = this.props.component
    return (
      <Drawer {...this.getDrawerProps(this.props.drawerProps)}>
        <Component onProfileClose={this.handleProfileClose} {...this.props.componentProps} />
      </Drawer>
    )
  }
}

export default SidePanel
