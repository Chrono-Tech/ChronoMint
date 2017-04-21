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
import { checkTestRPC, checkNetworkAndLogin } from '../redux/network/networkAction'

const mapStateToProps = (state) => ({
  errors: state.get('network').errors,
  selectedAccount: state.get('network').selectedAccount,
  isTestRPC: state.get('network').isTestRPC
})

const mapDispatchToProps = (dispatch) => ({
  handleLogin: (account) => dispatch(login(account, true)),
  checkRPC: () => dispatch(checkTestRPC()),
  checkNetworkAndLogin: (account) => dispatch(checkNetworkAndLogin(account))
})

@connect(mapStateToProps, mapDispatchToProps)
class Login extends Component {
  componentWillMount () {
    this.props.checkRPC()
  }

  handleLogin = () => {
    this.props.checkNetworkAndLogin(this.props.selectedAccount)
  }

  render () {
    const { errors, isTestRPC } = this.props
    return (
      <div style={styles.loginContainer}>
        <Paper style={styles.paper}>
          <LoginMetamask onLogin={this.handleLogin} />
          <LoginUPort onLogin={this.handleLogin} />
          <LoginMnemonic onLogin={this.handleLogin} />
          <LoginPrivateKey onLogin={this.handleLogin} />
          {isTestRPC && <LoginLocal onLogin={this.handleLogin} />}
          {errors && (
            <List>
              {errors.map((error, index) => (
                <ListItem
                  key={index}
                  leftIcon={<WarningIcon color={yellow800} />}
                  primaryText={error} />
              ))}
            </List>
          )}
        </Paper>
      </div>
    )
  }
}

export default Login
