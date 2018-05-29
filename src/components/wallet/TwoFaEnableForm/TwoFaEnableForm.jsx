/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Button } from 'components'
import QRCode from 'qrcode'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { Checkbox, TextField } from 'redux-form-material-ui'
import { change, Field, formValueSelector, reduxForm } from 'redux-form/immutable'
import { goToWallets } from 'redux/mainWallet/actions'
import { checkConfirmCode, get2FAEncodedKey } from 'redux/multisigWallet/actions'
import PropTypes from 'prop-types'
import TWO_FA_LOGO_PNG from 'assets/img/2fa/2-fa.png'
import APPSTORE_SVG from 'assets/img/appstore.svg'
import PLAY_SVG from 'assets/img/play.svg'
import WidgetContainer from 'components/WidgetContainer/WidgetContainer'
import { DUCK_SESSION } from 'redux/session/actions'
import { prefix } from './lang'
import './TwoFaEnableForm.scss'

export const FORM_2FA_ENABLE = 'Form2FAEnable'
const STEPS = [
  'downloadStep',
  'enableStep',
]

function mapStateToProps (state) {
  const { account } = state.get(DUCK_SESSION)
  const selector = formValueSelector(FORM_2FA_ENABLE)
  const code = selector(state, 'code')
  const confirmToken = selector(state, 'confirmToken')
  return {
    account,
    code,
    confirmToken,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleGoWallets: () => dispatch(goToWallets()),
    get2FAEncodedKey: (walletAddress) => {
      dispatch(get2FAEncodedKey(walletAddress, (code) => {
        dispatch(change(FORM_2FA_ENABLE, 'code', code))
      }))
    },
    checkConfirmCode: (secret, confToken) => dispatch(checkConfirmCode(secret, confToken)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_2FA_ENABLE })
export default class TwoFaEnableForm extends PureComponent {
  static propTypes = {
    account: PropTypes.string,
    confirmToken: PropTypes.number,
    checkConfirmCode: PropTypes.func,
    feeMultiplier: PropTypes.number,
    handleGoWallets: PropTypes.func,
    handleGoTo2FA: PropTypes.func,
    code: PropTypes.string,
    get2FAEncodedKey: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.state = {
      step: STEPS[0],
      qrData: null,
    }
  }

  componentDidMount () {
    this.props.get2FAEncodedKey(this.props.account)
  }

  componentWillReceiveProps (newProps) {
    if (newProps.code && newProps.code !== this.props.code) {
      const code = `otpauth://totp/Example:chrono@google.com?secret=${newProps.code}&issuer=2fa`
      QRCode.toDataURL(code, (err, qrData) => {
        this.setState({
          qrData,
        })
      })
    }
  }

  handleShowNextStep = () => {
    this.setState({ step: STEPS[1] })
  }

  handleCheckConfirmCode = () => {
    const { checkConfirmCode, code, confirmToken } = this.props
    checkConfirmCode(code, confirmToken)
  }

  renderDownloadStep () {
    return (
      <div>
        <div styleName='img'><img src={TWO_FA_LOGO_PNG} alt='2 fa logo' /></div>
        <div styleName='title'><Translate value={`${prefix}.title`} /></div>
        <div styleName='description'><Translate value={`${prefix}.description_1`} /></div>
        <div styleName='description'><Translate value={`${prefix}.description_2`} /></div>
        <div styleName='description'><Translate value={`${prefix}.description_3`} /></div>
        <div styleName='markets'>
          <img src={APPSTORE_SVG} alt='Apple AppStore' />
          <img src={PLAY_SVG} alt='Google play' />
        </div>
        <div styleName='actions'>
          <Button
            onTouchTap={this.handleShowNextStep}
            label={<Translate value={`${prefix}.proceed`} />}
          />
        </div>
      </div>
    )
  }

  renderEnableStep () {

    return (
      <div>
        <div styleName='enableStep'>
          <div styleName='step'>
            <div styleName='stepNumber'>1</div>
            <div styleName='title'><Translate value={`${prefix}.firstStepTitle`} /></div>
            <div styleName='description'><Translate value={`${prefix}.firstStepDescription`} /></div>
            <div styleName='code'>{this.props.code}</div>
          </div>
          <div styleName='step'>
            <div styleName='stepNumber'>2</div>
            <div styleName='title'><Translate value={`${prefix}.secondStepTitle`} /></div>
            <div styleName='description'><Translate value={`${prefix}.secondStepDescription`} /></div>
            <div styleName='qrCode'><img alt='qr code' src={this.state.qrData} /></div>
          </div>
          <div styleName='step'>
            <div styleName='stepNumber'>3</div>
            <div styleName='title'><Translate value={`${prefix}.thirdStepTitle`} /></div>
            <div styleName='description'><Translate value={`${prefix}.thirdStepDescription`} /></div>
            <div styleName='field'>
              <Field
                component={TextField}
                name='confirmToken'
                floatingLabelText={<Translate value={`${prefix}.authCode`} />}
              />
            </div>
          </div>
        </div>
        <div styleName='confirm'>
          <div styleName='checkbox'>
            <Field
              component={Checkbox}
              name='confirmRules'
            />
          </div>
          <div styleName='confirmDescription'><Translate value={`${prefix}.confirm`} /></div>
        </div>
        <div styleName='actions'>
          <Button
            onTouchTap={this.handleCheckConfirmCode}
            label={<Translate value={`${prefix}.proceed`} />}
          />
        </div>
      </div>
    )

  }

  render () {
    const { step } = this.state
    return (
      <WidgetContainer title={`${prefix}.pageTitle`}>
        <div styleName='root'>
          {step === STEPS[0] && this.renderDownloadStep()}
          {step === STEPS[1] && this.renderEnableStep()}
        </div>
      </WidgetContainer>
    )
  }
}
