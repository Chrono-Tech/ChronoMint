import MaterialDrawer from 'material-ui/Drawer'
import transitions from 'material-ui/styles/transitions'

const userInfoHeight = 150

class Drawer extends MaterialDrawer {
  // noinspection JSUnusedGlobalSymbols
  onBodyTouchMove = (event) => {
  };

  // noinspection JSUnusedGlobalSymbols
  onBodyTouchEnd = (event) => {
  };

  // noinspection JSUnusedGlobalSymbols
  getStyles () {
    const muiTheme = this.context.muiTheme
    const theme = muiTheme.drawer

    const y = -1 * (this.state.open ? 0 : userInfoHeight)
    const width = this.state.open ? (this.props.width || theme.width)
      : (window.innerWidth > 992 ? 56 : 0)

    return {
      root: {
        height: `calc(100% + ${userInfoHeight}px)`,
        width: width,
        position: 'fixed',
        zIndex: muiTheme.zIndex.drawer,
        left: 0,
        top: 0,
        transform: `translate(0, ${y}px)`,
        transition: !this.state.swiping && transitions.easeOut(null, 'all', null),
        backgroundColor: theme.color,
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch' // iOS momentum scrolling
      },
      overlay: {
        zIndex: muiTheme.zIndex.drawerOverlay,
        pointerEvents: this.state.open ? 'auto' : 'none' // Bypass mouse events when left nav is closing.
      },
      rootWhenOpenRight: {
        left: 'auto',
        right: 0
      }
    }
  }
}

export default Drawer
