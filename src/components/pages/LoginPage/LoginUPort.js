// TODO MINT-160 UPort provider
/* eslint-disable */
import React, { Component } from 'react'
import styles from './styles'
import { RaisedButton } from 'material-ui'
import { loginUport } from '../../../redux/network/actions'
import { connect } from 'react-redux'

const mapDispatchToProps = (dispatch) => ({
  loginUport: () => dispatch(loginUport())
})

@connect(null, mapDispatchToProps)
class LoginUPort extends Component {
  handleLoginClick = () => {
    this.props.loginUport().then(() => {
      this.props.onLogin()
    })
  }

  render () {
    return (
      <RaisedButton
        label={`Uport Login`}
        primary
        fullWidth
        onTouchTap={this.handleLoginClick}
        style={styles.primaryButton} />
    )
  }
}

export default LoginUPort
