import { ModalStack, Snackbar, SideStack } from 'components'
import { MuiThemeProvider } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { closeNotifier } from 'redux/notifier/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import theme from 'styles/themes/default'
import './Markup.scss'
import { DrawerPartial, HeaderPartial } from './partials'

function mapStateToProps (state) {
  return {
    isCBE: state.get(DUCK_SESSION).isCBE,
    notice: state.get('notifier').notice,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleCloseNotifier: () => dispatch(closeNotifier()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Markup extends PureComponent {
  static propTypes = {
    isCBE: PropTypes.bool,
    notice: PropTypes.instanceOf(Object),
    handleCloseNotifier: PropTypes.func,
    children: PropTypes.node,
  }

  render () {
    return (
      <MuiThemeProvider muiTheme={theme}>
        <div styleName='root'>
          <div styleName='drawer' className={this.props.isCBE ? 'drawer-cbe' : null}>
            <DrawerPartial />
          </div>
          <div styleName='middle'>
            <div styleName='middleTop'>
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
            <div styleName='middleContent'>
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
