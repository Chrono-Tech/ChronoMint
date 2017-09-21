import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Checkbox, MuiThemeProvider, RaisedButton, TextField } from 'material-ui'
import download from 'react-file-download'
import { Translate } from 'react-redux-i18n'
import { actions } from 'Login/settings'
import { addError, clearErrors } from 'Login/redux/network/actions'
import Warning from 'Login/components/Warning/Warning'
import BackButton from 'Login/components/BackButton/BackButton'
import theme from 'styles/themes/default'
import styles from 'Login/components/stylesLoginPage'
import './GenerateWallet.scss'

const initialState = {
  password: '',
  isWarningSuppressed: false,
  walletJSON: null,
  isDownloaded: false
}

const mapDispatchToProps = (dispatch) => ({
  addError: (error) => dispatch(addError(error)),
  clearErrors: () => dispatch(clearErrors())
})

@connect(null, mapDispatchToProps)
class GenerateWallet extends Component {
  static propTypes = {
    onBack: PropTypes.func.isRequired,
    addError: PropTypes.func,
    clearErrors: PropTypes.func
  }

  constructor () {
    super()
    this.state = {
      ...initialState
    }
  }

  handlePasswordChange = (target, value) => {
    this.setState({password: value})
  }

  handleWarningCheck = (target, value) => {
    this.setState({isWarningSuppressed: value})
  }

  handleGenerateWalletClick = async () => {
    this.props.clearErrors()
    try {
      if (!this.state.walletJSON) {
        // create new instance
        const walletJSON = await actions.walletGenerator(this.state.password)
        this.setState({
          walletJSON,
          password: ''
        })
      }

      const wallet = this.state.walletJSON
      download(JSON.stringify(wallet), `${wallet.id}.dat`)
      this.setState({
        isDownloaded: true
      })
    } catch (e) {
      this.props.addError(e.message)
    }
  }

  render () {
    const {password, isWarningSuppressed, isDownloaded} = this.state
    const isPasswordValid = password.length > 8

    return (
      <div>
        <BackButton
          onClick={() => this.props.onBack()}
          to='loginWithWallet'
        />
        <MuiThemeProvider muiTheme={theme}>
          <div styleName='root'>
            {!isDownloaded ? (
              <div>
                <div styleName='hint'><Translate value='GenerateWallet.enterPassword'/></div>
                <TextField
                  floatingLabelText={<Translate value='GenerateWallet.password'/>}
                  onChange={this.handlePasswordChange}
                  type='password'
                  value={password}
                  errorText={!isPasswordValid && <Translate value='GenerateWallet.passwordWarning'/>}
                  fullWidth/>
                <Warning/>
              </div>
            ) : (
              <div styleName='hint'><Translate value='GenerateWallet.walletSuccess'/></div>
            )}
            <div styleName='actions'>
              {!isDownloaded && (
                <div styleName='actionConfirm'>
                  <Checkbox
                    label={<Translate value='GenerateWallet.iUnderstand'/>}
                    onCheck={this.handleWarningCheck}
                    checked={isWarningSuppressed}
                    {...styles.checkbox}
                  />
                </div>
              )}
              <RaisedButton
                label={<Translate value='GenerateWallet.continue'/>}
                primary
                disabled={!isDownloaded && (!isWarningSuppressed || !isPasswordValid)}
                onTouchTap={this.handleGenerateWalletClick}
                style={styles.primaryButton}
              />
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default GenerateWallet
