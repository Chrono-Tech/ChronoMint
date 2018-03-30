import mnemonicProvider from '@chronobank/login/network/mnemonicProvider'
import { CircularProgress, TextField } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import BackButton from '../../components/BackButton/BackButton'
import styles from '../../components/stylesLoginPage'
import { Button } from '../../settings'

import './LoginWithMnemonic.scss'

const mapStateToProps = (state) => ({
  isLoading: state.get('network').isLoading,
})

@connect(mapStateToProps, null)
class LoginWithMnemonic extends PureComponent {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    onGenerate: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
  }

  constructor (props) {
    super(props)
    this.state = {
      mnemonicKey: '',
      isValidated: false,
    }
  }

  componentWillMount () {
    // use it for tests
    // address: 0x13f219bbb158a49b3e09505fccc333916f11bacb
    // this.setState({
    //   mnemonicKey: 'leave plate clog interest recall distance actor gun flash cupboard ritual hold',
    //   isValidated: true
    // })
    this.setState({ mnemonicKey: '' })
  }

  componentWillUnmount () {
    this.setState({ mnemonicKey: '' })
  }

  handleMnemonicBlur = () => {
    this.setState({ mnemonicKey: this.mnemonicKey.getValue().trim() })
  }

  handleMnemonicChange = () => {
    const mnemonicKey = this.mnemonicKey.getValue()
    const isValidated = mnemonicProvider.validateMnemonic(mnemonicKey.trim())
    this.setState({ mnemonicKey, isValidated })
  }

  render () {
    const { isLoading } = this.props
    const { mnemonicKey, isValidated } = this.state

    return (
      <div styleName='root'>
        <BackButton
          onClick={() => this.props.onBack()}
          to='options'
        />
        <div onTouchTap={() => this.mnemonicKey.focus()}>
          <TextField
            ref={(input) => {
              this.mnemonicKey = input
            }}
            floatingLabelText={<Translate value='LoginWithMnemonic.mnemonicKey' />}
            value={mnemonicKey}
            onChange={this.handleMnemonicChange}
            onBlur={this.handleMnemonicBlur}
            errorText={(isValidated || mnemonicKey === '') ? '' : <Translate value='LoginWithMnemonic.wrongMnemonic' />}
            multiLine
            fullWidth
            disabled={isLoading}
            {...styles.textField}
          />
        </div>
        <div styleName='actions'>
          <div styleName='action'>
            <Button
              flat
              fullWidth
              disabled={isLoading}
              onTouchTap={() => this.props.onGenerate()}
            >
              <Translate value='LoginWithMnemonic.generateMnemonic' />
            </Button>
          </div>
          <div styleName='action'>
            <Button
              label={isLoading
                ? <CircularProgress
                  style={{ verticalAlign: 'middle', marginTop: -2 }}
                  size={24}
                  thickness={1.5}
                />
                : <Translate value='LoginWithMnemonic.loginWithMnemonic' />}
              disabled={!isValidated || isLoading}
              onTouchTap={() => this.props.onLogin(mnemonicKey)}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default LoginWithMnemonic
