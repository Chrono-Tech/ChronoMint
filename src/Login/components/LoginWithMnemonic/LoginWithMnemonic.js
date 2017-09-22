import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { CircularProgress, FlatButton, RaisedButton, TextField } from 'material-ui'
import { Translate } from 'react-redux-i18n'
import { assets } from 'Login/settings'
import mnemonicProvider from 'Login/network/mnemonicProvider'
import BackButton from 'Login/components/BackButton/BackButton'
import styles from 'Login/components/stylesLoginPage'
import './LoginWithMnemonic.scss'

const mapStateToProps = (state) => ({
  isLoading: state.get('network').isLoading
})

@connect(mapStateToProps, null)
class LoginWithMnemonic extends Component {

  static propTypes = {
    onLogin: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    onGenerate: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      mnemonicKey: '',
      isValidated: false
    }
  }

  componentWillMount () {
    // use it for tests
    // address: 0x13f219bbb158a49b3e09505fccc333916f11bacb
    // this.setState({
    //   mnemonicKey: 'leave plate clog interest recall distance actor gun flash cupboard ritual hold',
    //   isValidated: true
    // })
    this.setState({mnemonicKey: ''})
  }

  componentWillUnmount () {
    this.setState({mnemonicKey: ''})
  }

  handleMnemonicBlur = () => {
    this.setState({mnemonicKey: this.mnemonicKey.getValue().trim()})
  }

  handleMnemonicChange = () => {
    const mnemonicKey = this.mnemonicKey.getValue()
    const isValidated = mnemonicProvider.validateMnemonic(mnemonicKey.trim())
    this.setState({mnemonicKey, isValidated})
  }

  render () {
    const {isLoading} = this.props
    const {mnemonicKey, isValidated} = this.state

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
            floatingLabelText={<Translate value='LoginWithMnemonic.mnemonicKey'/>}
            value={mnemonicKey}
            onChange={this.handleMnemonicChange}
            onBlur={this.handleMnemonicBlur}
            errorText={(isValidated || mnemonicKey === '') ? '' : <Translate value='LoginWithMnemonic.wrongMnemonic'/>}
            multiLine
            fullWidth
            disabled={isLoading}
            {...styles.textField} />
        </div>
        <div styleName='actions'>
          <div styleName='action'>
            <FlatButton
              label={<Translate value='LoginWithMnemonic.generateMnemonic'/>}
              fullWidth
              disabled={isLoading}
              onTouchTap={() => this.props.onGenerate()}
              icon={<img styleName='generateIcon' src={assets.MnemonicGenerateIcon}/>}
              {...styles.flatButton} />
          </div>
          <div styleName='action'>
            <RaisedButton
              label={isLoading
                ? <CircularProgress
                  style={{verticalAlign: 'middle', marginTop: -2}}
                  size={24}
                  thickness={1.5}/>
                : <Translate value='LoginWithMnemonic.loginWithMnemonic'/>}
              fullWidth
              primary
              disabled={!isValidated || isLoading}
              onTouchTap={() => this.props.onLogin(mnemonicKey)}
              {...styles.primaryButton} />
          </div>
        </div>
      </div>
    )
  }
}

export default LoginWithMnemonic
