import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { MuiThemeProvider, Snackbar as MaterialSnackbar } from 'material-ui'
import { HeaderPartial, DrawerPartial } from './partials'
import { ModalStack, Snackbar } from 'components'
import ModalContainer from 'components/modals/Modal'
import { closeNotifier } from 'redux/notifier/actions'

import theme from 'styles/themes/default.js'

// import 'styles/globals/index.global.css'

import './Markup.scss'

export class Markup extends React.Component {

  static propTypes = {
    isCBE: PropTypes.bool,
    notice: PropTypes.object,
    handleCloseNotifier: PropTypes.func,
    children: PropTypes.node
  }

  render () {
    return (
      <MuiThemeProvider muiTheme={theme}>
        <div styleName='root'>
          <div styleName='drawer' className={this.props.isCBE ? 'drawer-cbe' : null}>
            <DrawerPartial />
          </div>
          <div styleName='middle'>
            <div styleName='top'>
              <HeaderPartial />
            </div>
            <div styleName='snackbar'>
              <div styleName='panel'>
                {this.props.notice
                  ? (<Snackbar notice={this.props.notice} />)
                  : null
                }
              </div>
            </div>
            <div styleName='content'>
              {this.props.children}
            </div>
          </div>
          <div styleName='bottom'/>
          <ModalStack />
          <ModalContainer />
          <MaterialSnackbar
            open={!!this.props.notice}
            message={this.props.notice ? this.props.notice.message() : ''}
            autoHideDuration={4000}
            bodyStyle={{height: 'initial', lineHeight: 2}}
            onRequestClose={this.props.handleCloseNotifier}
          />
        </div>
      </MuiThemeProvider>
    )
  }
}

function mapStateToProps (state) {
  const session = state.get('session')
  const notifier = state.get('notifier')
  return {
    isCBE: session.isCBE,
    notice: notifier.notice /** @see null | AbstractNoticeModel */
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleCloseNotifier: () => dispatch(closeNotifier())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Markup)
