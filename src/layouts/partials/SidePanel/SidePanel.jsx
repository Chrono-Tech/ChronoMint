import { connect } from "react-redux"
import PropTypes from "prop-types"
import React, { PureComponent } from 'react'
import { Drawer } from 'material-ui'
import Profile from 'layouts/partials/ProfileContent/ProfileContent'
import { sidesPush } from 'redux/sides/actions'

export const SIDE_PANEL_KEY = 'ProfileSidePanelKey'

function mapStateToProps () {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    handlePanelClose: () => {
      dispatch(sidesPush({
        component: SidePanel,
        key: SIDE_PANEL_KEY,
        props: { isOpened: false },
      }))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class SidePanel extends PureComponent {

  static propTypes = {
    isOpened: PropTypes.bool,
    handlePanelClose: PropTypes.func,
  }

  static defaultProps = {
    isOpened: false,
    handlePanelClose: () => {},
  }

  render () {
    return (
      <Drawer
        openSecondary
        open={this.props.isOpened}
        overlayStyle={{ opacity: 0 }}
        onRequestChange={this.props.handlePanelClose}
        disableSwipeToOpen
        width={380}
        docked={false}
      >
        <Profile />
      </Drawer>
    )
  }
}

export default SidePanel
