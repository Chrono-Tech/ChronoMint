import { Translate } from 'react-redux-i18n'
import { ModalStack, SideStack, Snackbar } from 'components'
import menu from 'menu'
import classnames from 'classnames'
import { IconButton, MuiThemeProvider } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { closeNotifier, DUCK_NOTIFIER } from 'redux/notifier/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import theme from 'styles/themes/default'
import { DUCK_SIDES, SIDES_TOGGLE_MAIN_MENU } from 'redux/sides/actions'
import './Markup.scss'
import { DrawerMainMenu, HeaderPartial } from './partials'

function mapStateToProps (state) {
  return {
    isCBE: state.get(DUCK_SESSION).isCBE,
    notice: state.get(DUCK_NOTIFIER).notice,
    mainMenuIsOpen: state.get(DUCK_SIDES).mainMenuIsOpen,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleCloseNotifier: () => dispatch(closeNotifier()),
    onToggleMainMenu: (mainMenuIsOpen) => dispatch({ type: SIDES_TOGGLE_MAIN_MENU, mainMenuIsOpen }),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Markup extends PureComponent {
  static propTypes = {
    isCBE: PropTypes.bool,
    notice: PropTypes.instanceOf(Object),
    handleCloseNotifier: PropTypes.func,
    children: PropTypes.node,
    location: PropTypes.shape({
      action: PropTypes.string,
      hash: PropTypes.string,
      key: PropTypes.string,
      pathname: PropTypes.string,
      query: PropTypes.object,
      search: PropTypes.string,
      state: PropTypes.string,
    }),
    onToggleMainMenu: PropTypes.func,
    mainMenuIsOpen: PropTypes.bool,
  }

  handleToggleMainMenu = () => {
    this.props.onToggleMainMenu(!this.props.mainMenuIsOpen)
  }

  handleToggleMainMenuAndScroll = () => {
    window.scrollTo(0, 0)
    this.contentWrapper.scrollTo(0, 0)
    this.handleToggleMainMenu()
  }

  setRef = (el) => {
    this.contentWrapper = el
  }

  renderPageTitle = () => {
    const { pathname } = this.props.location
    let currentPage = null

    menu.user.map((item) => {
      if (item.path === pathname) {
        currentPage = item
      }
    })

    if (!currentPage) {
      menu.cbe.map((item) => {
        if (item.path === pathname) {
          currentPage = item
        }
      })
    }

    if (currentPage) {
      return <Translate value={currentPage.title} />
    }
  }

  render () {
    return (
      <MuiThemeProvider muiTheme={theme}>
        <div styleName='root'>
          <div styleName={classnames('mainMenu', { 'open': this.props.mainMenuIsOpen })}>
            <DrawerMainMenu onSelectLink={this.handleToggleMainMenuAndScroll} />
            <div styleName='overlay' onTouchTap={this.handleToggleMainMenu} />
          </div>
          <div styleName='middle'>
            <div styleName='middleTop'>
              <div styleName='mainMenuToggle'>
                <IconButton onTouchTap={this.handleToggleMainMenu}>
                  <i className='material-icons'>menu</i>
                </IconButton>
              </div>
              <div styleName='pageTitle'>
                {this.renderPageTitle()}
              </div>
              <HeaderPartial />
            </div>
            <div styleName='middleSnackbar'>
              <div styleName='middleSnackbarPanel'>
                {this.props.notice
                  ? (
                    <Snackbar
                      notice={this.props.notice}
                      autoHideDuration={4000}
                      onRequestClose={this.props.handleCloseNotifier}
                    />)
                  : null
                }
              </div>
            </div>
            <div styleName='middleContent' id='contentWrapper' ref={this.setRef}>
              {this.props.children}
            </div>
          </div>
          <div styleName='middleBottom' />
          <SideStack />
          <ModalStack />
        </div>
      </MuiThemeProvider>
    )
  }
}
