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
import theme from 'styles/themes/default'
import { DUCK_SIDES } from 'redux/sides/constants'
import { DUCK_MODALS } from '@chronobank/core/redux/modals/constants'
import MuiThemeProvider from '@material-ui/core/es/styles/MuiThemeProvider'
import IconButton from '@material-ui/core/es/IconButton/IconButton'
import DrawerMainMenu from 'layouts/partials/DrawerMainMenu/DrawerMainMenu'
import HeaderPartial from 'layouts/partials/HeaderPartial/HeaderPartial'
import { toggleMainMenu } from 'redux/sides/actions'

import './Markup.scss'

const mapStateToProps = (state) => {
  return {
    router: state.get('router'),
    notice: state.get(DUCK_NOTIFIER).notice,
    mainMenuIsOpen: state.get(DUCK_SIDES).mainMenuIsOpen,
    modalStackSize: state.get(DUCK_MODALS).stack.length,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleCloseNotifier: () => dispatch(closeNotifier()),
    onToggleMainMenu: (mainMenuIsOpen) => dispatch(toggleMainMenu(mainMenuIsOpen)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Markup extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    handleCloseNotifier: PropTypes.func,
    mainMenuIsOpen: PropTypes.bool,
    modalStackSize: PropTypes.number,
    notice: PropTypes.instanceOf(Object),
    onToggleMainMenu: PropTypes.func,
    router: PropTypes.any,
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
    const location = this.props.router.toJS().location
    let currentPage = null

    const filter = (item) => {
      if (item.path === location.pathname) {
        currentPage = item
      }
    }
    menu.user.map(filter)
    if (!currentPage) {
      menu.cbe.map(filter)
    }

    if (!currentPage) {
      Object.keys(BUTTONS).forEach((path) => {
        if (path === location.pathname) {
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
              <HeaderPartial location={location} />
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
            <div className={location.pathname} styleName='middleContent' id='contentWrapper' ref={this.setRef}>
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
