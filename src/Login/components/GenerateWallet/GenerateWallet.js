import { Checkbox, MuiThemeProvider, RaisedButton, TextField } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import download from 'react-file-download'

import { addError, clearErrors } from '../../redux/network/actions'
import BackButton from '../../components/BackButton/BackButton'
import styles from '../../components/stylesLoginPage'
import walletGenerator from '../../network/walletGenerator'
import Warning from '../../components/Warning/Warning'

import './GenerateWallet.scss'

const initialState = {
  password: '',
  isWarningSuppressed: false,
  walletJSON: null,
  isDownloaded: false,
}

const mapDispatchToProps = dispatch => ({
  addError: error => dispatch(addError(error)),
  clearErrors: () => dispatch(clearErrors()),
})

@connect(null, mapDispatchToProps)
class GenerateWallet extends PureComponent {
  static propTypes = {
    onBack: PropTypes.func.isRequired,
    addError: PropTypes.func,
    clearErrors: PropTypes.func,
  }

  constructor (props, context, updater) {
    super(props, context, updater)

    // TODO replace with async arrow when class properties will work correctly
    this.handleGenerateWalletClick = this.handleGenerateWalletClick.bind(this)

    this.state = {
      ...initialState,
    }
  }

  handlePasswordChange = (target, value) => {
    this.setState({ password: value })
  }

  handleWarningCheck = (target, value) => {
    this.setState({ isWarningSuppressed: value })
  }

  async handleGenerateWalletClick () {
    this.props.clearErrors()
    try {
      if (!this.state.walletJSON) {
        // create new instance
        const walletJSON = await walletGenerator.getWallet(this.state.password)
        this.setState({
          walletJSON,
          password: '',
        })
      }

      const wallet = this.state.walletJSON
      download(JSON.stringify(wallet), `${wallet.id}.dat`)
      this.setState({
        isDownloaded: true,
      })
    } catch (e) {
      this.props.addError(e.message)
    }
  }

  render () {
    const { password, isWarningSuppressed, isDownloaded } = this.state
    const isPasswordValid = password.length > 8

    return (
      <div>
        <BackButton
          onClick={() => this.props.onBack()}
          to='loginWithWallet'
        />
        <MuiThemeProvider muiTheme={styles.theme}>
          <div styleName='root'>
            {!isDownloaded ? (
              <div>
                <div styleName='hint'><Translate value='GenerateWallet.enterPassword' /></div>
                <TextField
                  floatingLabelText={<Translate value='GenerateWallet.password' />}
                  onChange={this.handlePasswordChange}
                  type='password'
                  value={password}
                  errorText={!isPasswordValid && <Translate value='GenerateWallet.passwordWarning' />}
                  fullWidth
                />
                <Warning />
              </div>
            ) : (
              <div styleName='hint'><Translate value='GenerateWallet.walletSuccess' /></div>
            )}
            <div styleName='actions'>
              {!isDownloaded && (
                <div styleName='actionConfirm'>
                  <Checkbox
                    label={<Translate value='GenerateWallet.iUnderstand' />}
                    onCheck={this.handleWarningCheck}
                    checked={isWarningSuppressed}
                    {...styles.checkbox}
                  />
                </div>
              )}
              <RaisedButton
                label={<Translate value='GenerateWallet.continue' />}
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
