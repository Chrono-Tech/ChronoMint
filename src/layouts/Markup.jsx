import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { MuiThemeProvider, Snackbar } from 'material-ui'
import { HeaderPartial, DrawerPartial } from './partials'
import { ModalStack } from 'components'
import ModalContainer from 'components/modals/Modal'
import { closeNotifier } from 'redux/notifier/notifier'

import theme from 'styles/themes/default.js'

// import 'styles/globals/index.global.css'

import './Markup.scss'

export class Markup extends React.Component {

  static propTypes = {
    notice: PropTypes.object,
    handleCloseNotifier: PropTypes.func,
    children: PropTypes.node,
    header: PropTypes.node,
    drawer: PropTypes.node,
  }

  static defaultProps = {
    header: <HeaderPartial />,
    drawer: <DrawerPartial />
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={theme}>
        <div styleName="root">
          <div styleName="drawer">
            {this.props.drawer}
          </div>
          <div styleName="middle">
            <div styleName="top">
              {this.props.header}
            </div>
            <div styleName="content">
              {this.props.children}
            </div>
          </div>
          <div styleName="bottom"></div>
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

const mapStateToProps = (state) => ({
  isFetching: state.get('session').isFetching,
  notice: state.get('notifier').notice /** @see null|AbstractNoticeModel */
})

const mapDispatchToProps = (dispatch) => ({
  handleCloseNotifier: () => dispatch(closeNotifier())
})

export default connect(mapStateToProps, mapDispatchToProps)(Markup)
