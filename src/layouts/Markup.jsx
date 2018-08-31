/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import Snackbar from 'components/common/Snackbar/Snackbar'
import SideStack from 'components/common/SideStack/SideStack'
import ModalStack from 'components/common/ModalStack/ModalStack'
import BUTTONS from 'components/common/TopButtons/buttons'
import menu from 'menu'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { closeNotifier } from '@chronobank/core/redux/notifier/actions'
import { DUCK_NOTIFIER } from '@chronobank/core/redux/notifier/constants'
import { DUCK_SESSION } from '@chronobank/core/redux/session/constants'
import theme from 'styles/themes/default'
import { DUCK_SIDES } from 'redux/sides/constants'
import { DUCK_MODALS } from 'redux/modals/constants'
import MuiThemeProvider from '@material-ui/core/es/styles/MuiThemeProvider'
import IconButton from '@material-ui/core/es/IconButton/IconButton'
import DrawerMainMenu from 'layouts/partials/DrawerMainMenu/DrawerMainMenu'
import HeaderPartial from 'layouts/partials/HeaderPartial/HeaderPartial'
import { toggleMainMenu } from 'redux/sides/actions'
import { navigateToLoginPage } from '@chronobank/login-ui/redux/navigation'

import './Markup.scss'

function mapStateToProps (state) {
  return {
    notice: state.get(DUCK_NOTIFIER).notice,
    mainMenuIsOpen: state.get(DUCK_SIDES).mainMenuIsOpen,
    modalStackSize: state.get(DUCK_MODALS).stack.length,
    isLoggedIn: state.get(DUCK_SESSION).isSession,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    navigateToLoginPage: () => dispatch(navigateToLoginPage()),
    handleCloseNotifier: () => dispatch(closeNotifier()),
    onToggleMainMenu: (mainMenuIsOpen) => dispatch(toggleMainMenu(mainMenuIsOpen)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Markup extends PureComponent {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
    modalStackSize: PropTypes.number,
    notice: PropTypes.instanceOf(Object),
    handleCloseNotifier: PropTypes.func,
    navigateToLoginPage: PropTypes.func,
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

  componentDidMount () {
    // const { dispatch, currentURL } = this.props

    if (!this.props.isLoggedIn) {
      // set the current url/path for future redirection (we use a Redux action)
      // then redirect (we use a React Router method)
      // dispatch(setRedirectUrl(currentURL))
      this.props.navigateToLoginPage()
    }
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

    const filter = (item) => {
      if (item.path === pathname) {
        currentPage = item
      }
    }
    menu.user.map(filter)
    if (!currentPage) {
      menu.cbe.map(filter)
    }

    if (!currentPage) {
      Object.keys(BUTTONS).forEach((path) => {
        if (path === pathname) {
          currentPage = BUTTONS[path]
        }
      })
    }

    if (currentPage) {
      return <Translate value={currentPage.title} />
    }
  }

  render () {
    return (
      <MuiThemeProvider theme={theme}>
        <div styleName={classnames('root', { 'noScroll': this.props.modalStackSize > 0 })}>
          <div styleName={classnames('mainMenu', { 'open': this.props.mainMenuIsOpen })}>
            <DrawerMainMenu onSelectLink={this.handleToggleMainMenuAndScroll} />
            <div styleName='overlay' onClick={this.handleToggleMainMenu} />
          </div>
          <div styleName='middle'>
            <div styleName='middleTop'>
              <div styleName='mainMenuToggle'>
                <IconButton onClick={this.handleToggleMainMenu}>
                  <i className='material-icons'>menu</i>
                </IconButton>
              </div>
              <div styleName='pageTitle'>
                {this.renderPageTitle()}
              </div>
              <HeaderPartial location={this.props.location} />
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
