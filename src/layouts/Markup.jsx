import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { MuiThemeProvider, Snackbar } from 'material-ui'
import { HeaderPartial, DrawerPartial } from './partials'
import { ModalStack } from 'components'
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

  constructor (props) {
    super(props)

    this.state = {
      menu: {
        user: [
          {key: 'wallet', title: 'nav.chronobankWallet', icon: 'account_balance_wallet', path: '/new/wallet'},
          {key: 'exchange', title: 'nav.exchange', icon: 'compare_arrows'},
          {key: 'voting', title: 'nav.voting', icon: 'done'},
          // { key: "history", title: 'History', icon: 'history', path: '/markup/history' },
          // { key: "rewards", title: 'Rewards', icon: 'attach_money', path: '/markup/rewards' },
          {key: 'rewards', title: 'nav.rewards', icon: 'card_giftcard', path: '/rewards'},
          {key: 'oldInterface', title: 'nav.oldInterface', icon: 'dashboard', path: '/profile'}
        ],
        cbe: [
          {key: 'locs', title: 'nav.locs', icon: 'group', path: '/cbe/locs'},
          {key: 'pOperations', title: 'nav.operations', icon: 'alarm', path: '/cbe/operations'},
          {key: 'cbeSettings', title: 'nav.cbeSettings', icon: 'settings', path: '/cbe/settings'}
        ]
      }
    }
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={theme}>
        <div styleName='root'>
          <div styleName='drawer' className={this.props.isCBE ? 'drawer-cbe' : null}>
            <DrawerPartial menu={this.state.menu} />
          </div>
          <div styleName='middle'>
            <div styleName='top'>
              <HeaderPartial menu={this.state.menu} />
            </div>
            <div styleName='content'>
              {this.props.children}
            </div>
          </div>
          <div styleName='bottom'></div>
          <ModalStack />
          <ModalContainer />
          <Snackbar
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
    notice: notifier.notice /** @see null|AbstractNoticeModel */
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleCloseNotifier: () => dispatch(closeNotifier())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Markup)
