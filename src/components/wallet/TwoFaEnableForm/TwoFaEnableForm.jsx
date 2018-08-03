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
import { change, Field, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { goToWallets } from '@chronobank/core/redux/mainWallet/actions'
import { confirm2FASecret, get2FAEncodedKey } from '@chronobank/core/redux/multisigWallet/actions'
import { ETH_MULTISIG_2_FA_CONFIRMED } from '@chronobank/core/redux/multisigWallet/constants'
import PropTypes from 'prop-types'
import TWO_FA_LOGO_PNG from 'assets/img/2fa/2-fa.png'
import APPSTORE_SVG from 'assets/img/appstore.svg'
import PLAY_SVG from 'assets/img/play.svg'
import WidgetContainer from 'components/WidgetContainer/WidgetContainer'
import Preloader from 'components/common/Preloader/Preloader'
import { DUCK_SESSION } from '@chronobank/core/redux/session/actions'
import { FORM_2FA_ENABLE } from 'components/constants'
import { prefix } from './lang'
import validate from './validate'
import './TwoFaEnableForm.scss'

const STEPS = [
  'downloadStep',
  'enableStep',
  'successStep',
]

function mapStateToProps (state) {
  const { account } = state.get(DUCK_SESSION)
  const selector = formValueSelector(FORM_2FA_ENABLE)
  const code = selector(state, 'code')
  const confirmToken = selector(state, 'confirmToken')
  const confirmRules = selector(state, 'confirmRules')
  return {
    account,
    code,
    confirmToken,
    confirmRules,
    initialValues: {
      confirmRules: false,
    },
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleGoWallets: () => dispatch(goToWallets()),
    get2FAEncodedKey: () => {
      dispatch(get2FAEncodedKey((code) => {
        dispatch(change(FORM_2FA_ENABLE, 'code', code))
      }))
    },
    confirm2FASecret: (account, confirmToken, callback) => {
      dispatch(confirm2FASecret(account, confirmToken, callback))
    },
    handleSetTwoFAConfirmed: (twoFAConfirmed) => dispatch({ type: ETH_MULTISIG_2_FA_CONFIRMED, twoFAConfirmed }),
    handleGoToWallets: () => dispatch(goToWallets()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_2FA_ENABLE, validate })
export default class TwoFaEnableForm extends PureComponent {
  static propTypes = {
    handleSetTwoFAConfirmed: PropTypes.func,
    account: PropTypes.string,
    feeMultiplier: PropTypes.number,
    handleGoWallets: PropTypes.func,
    confirm2FASecret: PropTypes.func,
    handleGoTo2FA: PropTypes.func,
    code: PropTypes.string,
    get2FAEncodedKey: PropTypes.func,
    handleGoToWallets: PropTypes.func,
    ...formPropTypes,
  }

  constructor (props) {
    super(props)
    this.state = {
      step: STEPS[0],
      qrData: null,
      isLoading: false,
    }
  }

  componentDidMount () {
    this.props.get2FAEncodedKey()
  }

  componentWillReceiveProps (newProps) {
    if (newProps.code && newProps.code !== this.props.code) {
      const code = `otpauth://totp/${newProps.account}?secret=${newProps.code}&issuer=ChronoWallet-2FA`
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
    const { confirm2FASecret, account, confirmToken } = this.props
    this.setState({ isLoading: true, success: null })
    confirm2FASecret(account, confirmToken, (success) => {
      let newState = { isLoading: false, success }
      if (success) {
        newState.step = STEPS[2]
        this.props.handleSetTwoFAConfirmed(success)
      }
      this.setState(newState)
    })
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
            onClick={this.handleShowNextStep}
            label={<Translate value={`${prefix}.proceed`} />}
          />
        </div>
      </div>
    )
  }

  renderEnableStep () {
    const { isLoading, success } = this.state
    const { pristine, invalid, confirmRules } = this.props
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
            {!isLoading && <div styleName='description'><Translate value={`${prefix}.thirdStepDescription`} /></div>}
            {!isLoading ? (
              <div styleName='field'>
                <Field
                  component={TextField}
                  name='confirmToken'
                  floatingLabelText={<Translate value={`${prefix}.authCode`} />}
                />
                {success === false && <div styleName='wrongCode'><Translate value={`${prefix}.confirmCodeWrong`} /></div>}
              </div>
            ) : (
              <div><Preloader /></div>
            )}
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
            disabled={pristine || invalid || !confirmRules}
            onClick={this.handleCheckConfirmCode}
            label={<Translate value={`${prefix}.proceed`} />}
          />
        </div>
      </div>
    )
  }

  renderSuccessStep () {
    return (
      <div>
        <div styleName='title'><Translate value={`${prefix}.successTitle`} /></div>
        <div styleName='actions'>
          <Button
            onClick={this.props.handleGoToWallets}
            label={<Translate value={`${prefix}.goToWallets`} />}
          />
        </div>
      </div>
    )
  }

  render () {
    const { step } = this.state
    return (
      <WidgetContainer title={`${prefix}.pageTitle`}>
        <form styleName='root'>
          {step === STEPS[0] && this.renderDownloadStep()}
          {step === STEPS[1] && this.renderEnableStep()}
          {step === STEPS[2] && this.renderSuccessStep()}
        </form>
      </WidgetContainer>
    )
  }
}
