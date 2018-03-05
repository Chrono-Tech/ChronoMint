import { connect } from "react-redux"
import PropTypes from "prop-types"
import React, { PureComponent } from 'react'
import { Drawer } from 'material-ui'
import { sidesPush } from 'redux/sides/actions'
import ProfileContent from "../ProfileContent/ProfileContent"

function mapStateToProps () {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    handlePanelClose: (panelKey: string) => {
      dispatch(sidesPush({
        component: ProfileContent,
        panelKey: panelKey,
        isOpened: false,
      }))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class SidePanel extends PureComponent {

  static propTypes = {
    isOpened: PropTypes.bool,
    handlePanelClose: PropTypes.func,
    panelKey: PropTypes.string,
    component: PropTypes.func,
    componentProps: PropTypes.object,
  }

  static defaultProps = {
    isOpened: false,
    handlePanelClose: () => {},
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
    this.props.handlePanelClose(this.props.panelKey)
  }

  render () {
    const Component = this.props.component
    return (
      <Drawer
        openSecondary
        open={this.props.isOpened}
        overlayStyle={{ opacity: 0 }}
        onRequestChange={this.handleProfileClose}
        disableSwipeToOpen
        width={380}
        docked={false}
      >
        <Component onProfileClose={this.handleProfileClose} {...this.props.componentProps} />
      </Drawer>
    )
  }
}

export default SidePanel
