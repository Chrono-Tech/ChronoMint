import { CircularProgress, RaisedButton, TextField } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import BackButton from '../../components/BackButton/BackButton'
import privateKeyProvider from '../../network/privateKeyProvider'
import styles from '../../components/stylesLoginPage'

import './LoginWithPrivateKey.scss'

const mapStateToProps = (state) => ({
  isLoading: state.get('network').isLoading,
})

@connect(mapStateToProps, null)
class LoginWithPrivateKey extends PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool,
    onBack: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
  }

  constructor () {
    super()
    this.state = {
      privateKey: '',
      isValidated: false,
    }
  }

  handlePrivateKeyChange = () => {
    const privateKey = this.privateKey.getValue()
    const isValidated = privateKeyProvider.validatePrivateKey(privateKey.trim())
    this.setState({ privateKey, isValidated })
  }

  render () {
    const { isValidated, privateKey } = this.state
    const { isLoading } = this.props
    return (
      <div>
        <div styleName='back'>
          <BackButton
            onClick={() => this.props.onBack()}
            to='options'
          />
        </div>
        <TextField
          ref={(input) => {
            this.privateKey = input
          }}
          floatingLabelText={<Translate value='LoginWithPrivateKey.privateKey' />}
          value={privateKey}
          onChange={this.handlePrivateKeyChange}
          errorText={(isValidated || privateKey === '') ? '' : <Translate value='LoginWithPrivateKey.wrongPrivateKey' />}
          multiLine
          fullWidth
          spellCheck={false}
          {...styles.textField}
        />

        <div styleName='actions'>
          <div styleName='action'>
            <RaisedButton
              label={isLoading
                ? <CircularProgress
                  style={{ verticalAlign: 'middle', marginTop: -2 }}
                  size={24}
                  thickness={1.5}
                />: <Translate value='LoginWithPrivateKey.loginWithPrivateKey' />}
              fullWidth
              primary
              disabled={!isValidated || isLoading}
              onTouchTap={() => this.props.onLogin(privateKey)}
              {...styles.primaryButton}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default LoginWithPrivateKey
