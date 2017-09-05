import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Checkbox, MuiThemeProvider, RaisedButton, TextField } from 'material-ui'
import walletGenerator from '../../../../network/walletGenerator'
import download from 'react-file-download'
import { addError, clearErrors } from '../../../../redux/network/actions'
import theme from '../../../../styles/themes/default'
import Warning from '../Warning/Warning'
import BackButton from '../BackButton/BackButton'
import styles from '../stylesLoginPage'
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
        const walletJSON = await walletGenerator(this.state.password)
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
          to='login with wallet'
        />
        <MuiThemeProvider muiTheme={theme}>
          <div styleName='root'>
            {!isDownloaded ? (
              <div>
                <div styleName='hint'>Enter password for the new wallet:</div>
                <TextField
                  floatingLabelText='Password'
                  onChange={this.handlePasswordChange}
                  type='password'
                  value={password}
                  errorText={!isPasswordValid && 'At least 8 characters'}
                  fullWidth />
                <Warning />
              </div>
            ) : (
              <div styleName='hint'>Your wallet has been generated</div>
            )}
            <div styleName='actions'>
              {!isDownloaded && (
                <div styleName='grow'>
                  <Checkbox
                    label={'I\u00a0understand'}
                    onCheck={this.handleWarningCheck}
                    checked={isWarningSuppressed}
                    {...styles.checkbox}
                  />
                </div>
              )}
              <div styleName='action'>
                <RaisedButton
                  label='Download Wallet'
                  primary
                  fullWidth
                  disabled={!isDownloaded && (!isWarningSuppressed || !isPasswordValid)}
                  onTouchTap={this.handleGenerateWalletClick}
                  style={styles.primaryButton}
                />
              </div>
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default GenerateWallet
