import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CircularProgress, FlatButton, RaisedButton, TextField } from 'material-ui'
import styles from './styles'
import { clearErrors } from '../../../redux/network/actions'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'

const mapStateToProps = (state) => ({
  selectedProvider: state.get('network').selectedProvider,
  isError: state.get('network').errors.length > 0
})

const mapDispatchToProps = (dispatch) => ({
  clearErrors: () => dispatch(clearErrors())
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginUploadWallet extends Component {
  constructor () {
    super()
    this.state = {
      password: '',
      isWalletLoading: false
    }
  }

  componentWillMount () {
    this.setState({
      password: '',
      isWalletLoading: false
    })
  }

  componentWillReceiveProps (props) {
    if (props.isError) {
      this.setState({isWalletLoading: false})
    }
  }

  handlePasswordChange = () => {
    this.setState({password: this.refs.passwordInput.getValue()})
    this.props.clearErrors()
  }

  handleEnterPassword = () => {
    this.setState({isWalletLoading: true})
    this.props.clearErrors()
    this.forceUpdate()
    this.props.onLogin(this.state.password)
  }

  render () {
    const {password, isWalletLoading} = this.state

    return (
      <div>
        <TextField
          ref='passwordInput'
          floatingLabelText='Enter password'
          type='password'
          value={password}
          onChange={this.handlePasswordChange}
          required
          fullWidth />
        <RaisedButton
          label={isWalletLoading ? <CircularProgress
            style={{verticalAlign: 'middle', marginTop: -2}} size={24}
            thickness={1.5} /> : 'Login'}
          primary
          fullWidth
          disabled={isWalletLoading}
          onTouchTap={this.handleEnterPassword}
          style={styles.primaryButton} />
        {isWalletLoading && <div style={styles.tip}>
          <em>Be patient, it will take a while</em>
        </div>}
        <FlatButton
          label='Back'
          onTouchTap={this.props.onBack}
          style={styles.backBtn}
          icon={<ArrowBack />} />
      </div>
    )
  }
}

LoginUploadWallet.propTypes = {
  onBack: PropTypes.func,
  onLogin: PropTypes.func,
  clearErrors: PropTypes.func,
  onUpload: PropTypes.func,
  isError: PropTypes.bool
}

export default LoginUploadWallet
