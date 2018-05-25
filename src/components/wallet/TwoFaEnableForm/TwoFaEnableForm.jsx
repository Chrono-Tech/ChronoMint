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
import { Field, reduxForm } from 'redux-form/immutable'
import { goToWallets } from 'redux/mainWallet/actions'
import PropTypes from 'prop-types'
import TWO_FA_LOGO_PNG from 'assets/img/2fa/2-fa.png'
import APPSTORE_SVG from 'assets/img/appstore.svg'
import PLAY_SVG from 'assets/img/play.svg'
import WidgetContainer from 'components/WidgetContainer/WidgetContainer'
import { prefix } from './lang'
import './TwoFaEnableForm.scss'

export const FORM_2FA_ENABLE = 'Form2FAEnable'

function mapStateToProps () {
  return {
    code: 'otpauth://totp/Example:chrono@google.com?secret=UT45KQPOI1VBUI5P&issuer=2fa',
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleGoWallets: () => dispatch(goToWallets()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_2FA_ENABLE })
export default class TwoFaEnableForm extends PureComponent {
  static propTypes = {
    feeMultiplier: PropTypes.number,
    handleGoWallets: PropTypes.func,
    handleGoTo2FA: PropTypes.func,
    code: PropTypes.string,
  }

  constructor (props) {
    super(props)
    this.state = {
      qrData: null,
    }
  }

  componentDidMount () {
    QRCode.toDataURL(this.props.code, (err, qrData) => {
      this.setState({
        qrData,
      })
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
            <div styleName='code'>UT45KQPOI1VBUI5P</div>
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
                name='authCode'
                floatingLabelText={<Translate value={`${prefix}.authCode`} />}
              />
            </div>
          </div>
        </div>
        <div styleName='confirm'>
          <div styleName='checkbox'>
            <Field
              component={Checkbox}
              name='confirm'
            />
          </div>
          <div styleName='confirmDescription'><Translate value={`${prefix}.confirm`} /></div>
        </div>
        <div styleName='actions'>
          <Button
            label={<Translate value={`${prefix}.proceed`} />}
          />
        </div>
      </div>
    )

  }

  render () {
    return (
      <WidgetContainer title={`${prefix}.pageTitle`}>
        <div styleName='root'>
          {this.renderDownloadStep()}
          {this.renderEnableStep()}
        </div>
      </WidgetContainer>
    )
  }
}
