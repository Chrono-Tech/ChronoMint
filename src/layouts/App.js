import React, { Component } from 'react'
import { connect } from 'react-redux'
import ModalContainer from '../components/modals/Modal'
import Header from '../components/layout/Header/index'
import LeftDrawer from '../components/layout/LeftDrawer/index'
import withWidth, { LARGE } from 'material-ui/utils/withWidth'
import Snackbar from 'material-ui/Snackbar'
import withSpinner from '../hoc/withSpinner'
import { closeNotifier } from '../redux/notifier/notifier'
import LS from '../utils/LocalStorage'

const mapStateToProps = (state) => ({
  notice: state.get('notifier').notice /** @see null|AbstractNoticeModel */
})

const mapDispatchToProps = (dispatch) => ({
  handleCloseNotifier: () => dispatch(closeNotifier())
})

@connect(mapStateToProps, mapDispatchToProps)
@withSpinner
@withWidth()
class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      navDrawerOpen: props.width === LARGE,
      navDrawerDocked: props.width === LARGE
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.width !== nextProps.width) {
      this.setState({
        navDrawerDocked: nextProps.width === LARGE
      })
    }

    if (this.props.location.pathname !== nextProps.location.pathname) {
      LS.setLastURL(nextProps.location)
      if (nextProps.width !== LARGE) {
        // Close drawer on small screen when opened another page
        this.setState({
          navDrawerOpen: nextProps.width === LARGE
        })
      }
    }
  }

  onHandleChangeRequestNavDrawer = () => {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen
    })
  }

  render () {
    let {navDrawerOpen, navDrawerDocked} = this.state
    const paddingLeftDrawerOpen = 230
    const paddingLeft = this.props.width < LARGE ? 0
      : (navDrawerOpen ? paddingLeftDrawerOpen : 56)

    const style = {
      padding: '70px 20px 20px 20px',
      paddingLeft: paddingLeft + 20,
      transition: 'padding 450ms cubic-bezier(0.23, 1, 0.32, 1)'
    }

    return (
      <div>
        <Header handleChangeRequestNavDrawer={this.onHandleChangeRequestNavDrawer} />

        <LeftDrawer navDrawerOpen={navDrawerOpen} navDrawerDocked={navDrawerDocked}
          navDrawerChange={(open) => this.setState({navDrawerOpen: open})} />
        <div style={style}>
          {this.props.children}
        </div>

        <ModalContainer />

        <Snackbar
          open={!!this.props.notice}
          message={this.props.notice ? this.props.notice.message() : ''}
          autoHideDuration={4000}
          bodyStyle={{height: 'initial', lineHeight: 2}}
          onRequestClose={this.props.handleCloseNotifier}
        />
      </div>
    )
  }
}

export default App
