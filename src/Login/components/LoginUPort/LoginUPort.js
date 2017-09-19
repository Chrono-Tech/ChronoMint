import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { CircularProgress, RaisedButton } from 'material-ui'
import { loginUport, addError } from 'redux/network/actions'
import './LoginUPort.scss'
import { Translate } from 'react-redux-i18n'

const mapStateToProps = (state) => ({
  isLoading: state.get('network').isLoading
})

const mapDispatchToProps = (dispatch) => ({
  loginUport: () => dispatch(loginUport()),
  addError: (e) => dispatch(addError(e))
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginUPort extends Component {

  static propTypes = {
    addError: PropTypes.func,
    onLogin: PropTypes.func.isRequired,
    loginUport: PropTypes.func,
    isLoading: PropTypes.bool
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
    const {isLoading} = this.props

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
              : <Translate value='LoginUPort.login'/>
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
