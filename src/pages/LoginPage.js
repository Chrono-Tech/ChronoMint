import React, {Component} from 'react'
import { List, ListItem, Paper } from 'material-ui'
import {connect} from 'react-redux'
import {login} from '../redux/session/actions'
import LoginMetamask from '../components/pages/LoginPage/LoginMetamask'
import styles from '../components/pages/LoginPage/styles'
import LoginLocal from '../components/pages/LoginPage/LoginLocal'
import LoginUPort from '../components/pages/LoginPage/LoginUPort'
import WarningIcon from 'material-ui/svg-icons/alert/warning'
import { yellow800 } from 'material-ui/styles/colors'
import LoginMnemonic from '../components/pages/LoginPage/LoginMnemonic'
import LoginPrivateKey from '../components/pages/LoginPage/LoginPrivateKey'

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
          <LoginLocal onLogin={this.handleLogin} />
          <LoginMetamask onLogin={this.handleLogin} />
          <LoginUPort onLogin={this.handleLogin} />
          <LoginMnemonic onLogin={this.handleLogin} />
          <LoginPrivateKey onLogin={this.handleLogin} />
          {errors && (
            <List>
              {errors.map((e, i) => (
                <ListItem
                  key={i}
                  leftIcon={<WarningIcon color={yellow800} />}
                  primaryText={e.message} />
              ))}
            </List>
          )}
        </Paper>
      </div>
    )
  }
}

export default Login
