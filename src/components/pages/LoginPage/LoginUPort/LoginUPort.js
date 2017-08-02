import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { RaisedButton } from 'material-ui'
import { loginUport, addError } from '../../../../redux/network/actions'
import './LoginUPort.scss'

const mapDispatchToProps = (dispatch) => ({
  loginUport: () => dispatch(loginUport()),
  addError: (e) => dispatch(addError(e))
})

@connect(null, mapDispatchToProps)
class LoginUPort extends Component {

  static propTypes = {
    addError: PropTypes.func,
    onLogin: PropTypes.func.isRequired,
    loginUport: PropTypes.func
  }

  handleLoginClick = async () => {
    try {
      await this.props.loginUport()
      this.props.onLogin()
    } catch (e) {
      this.props.addError(e.message)
    }
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='action'>
          <RaisedButton
            label='Login'
            primary
            fullWidth
            onTouchTap={this.handleLoginClick}
          />
        </div>
      </div>
    )
  }
}

export default LoginUPort
