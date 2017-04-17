import React, {Component} from 'react'
import { Paper } from 'material-ui'
import {connect} from 'react-redux'
import {login} from '../redux/session/actions'
import LoginMetamask from '../components/pages/LoginPage/LoginMetamask'
import styles from '../components/pages/LoginPage/styles'
import LoginLocal from '../components/pages/LoginPage/LoginLocal'
import LoginUPort from '../components/pages/LoginPage/LoginUPort'

// TODO: Fix https://github.com/callemall/material-ui/issues/3923

const mapStateToProps = (state) => ({
  errors: state.get('network').errors,
  selectedAccount: state.get('network').selectedAccount
})

const mapDispatchToProps = (dispatch) => ({
  handleLogin: (account) => dispatch(login(account, true))
})

@connect(mapStateToProps, mapDispatchToProps)
class Login extends Component {
  handleLogin = () => {
    this.props.handleLogin(this.props.selectedAccount)
  }

  render () {
    const {errors} = this.props
    return (
      <div style={styles.loginContainer}>
        <Paper style={styles.paper}>
          {errors && errors.map(e => (
            <div>{e.message}</div>
          ))}
          <LoginLocal onLogin={this.handleLogin}/>
          <LoginMetamask onLogin={this.handleLogin} />
          <LoginUPort onLogin={this.handleLogin} />
        </Paper>
      </div>
    )
  }
}

export default Login
