import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { CircularProgress, RaisedButton } from 'material-ui'
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

  constructor (props) {
    super(props)
    this.state = {
      isLoading: false
    }
  }

  handleLoginClick = async () => {
    try {
      this.setState({isLoading: true})
      await this.props.loginUport()
      this.props.onLogin()
    } catch (e) {
      this.props.addError(e.message)
      this.setState({isLoading: false})
    }
  }

  render () {
    const {isLoading} = this.state

    return (
      <div styleName='root'>
        <div styleName='action'>
          <RaisedButton
            label={isLoading
              ? (
                <CircularProgress
                  style={{verticalAlign: 'middle', marginTop: -2}}
                  size={24}
                  thickness={1.5} />
              )
              : 'Login'
            }
            primary
            fullWidth
            disabled={isLoading}
            onTouchTap={this.handleLoginClick}
          />
        </div>
      </div>
    )
  }
}

export default LoginUPort
