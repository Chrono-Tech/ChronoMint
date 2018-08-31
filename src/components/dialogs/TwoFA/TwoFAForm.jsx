/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Two2FImg from 'assets/img/2fa/2-fa.png'
import { Checkbox, TextField } from 'redux-form-material-ui'
import Button from 'components/common/ui/Button/Button'
import React, { Component } from 'react'
import { Translate } from 'react-redux-i18n'
import { prefix } from './lang'
import './TwoFAForm.scss'

export default class TwoFAForm extends Component {

  handleEnable2FA: () => {}

  handleProceedToActivation: () => {}

  render () {
    return (
      <div styleName='root'>
        <div styleName='header'>
          <div styleName='title'><Translate value={`${prefix}.formTitle`} /></div>
        </div>
        <div styleName='body'>
          <div styleName='intro'>
            <img styleName='introImg' src={Two2FImg} />
            <div styleName='introCol'>
              <div styleName='introTitle'><Translate value={`${prefix}.introTitle`} /></div>
              <div styleName='introContent'>
                <p><Translate value={`${prefix}.introContent1`} /></p>
                <p><Translate value={`${prefix}.introContent2`} /></p>
              </div>
            </div>
          </div>

          <div>
            <div styleName='step'>
              <div styleName='stepBullet'>1</div>
              <div styleName='stepCol1'>
                <Translate
                  value={`${prefix}.step1Description`}
                  dangerousHTML
                  googleIcon={`<img styleName='storeIcon' src='TODO' />`}
                  appStoreIcon={`<img styleName='storeIcon' src='TODO' />`}
                />
                <Button
                  label={<Translate value={`${prefix}.proceedToActivation`} />}
                  styleName='action'
                  onClick={this.handleProceedToActivation}
                />
              </div>
              <div styleName='stepCol2 highlight step1'>
                <div styleName='step1arrow'>arrow</div>
                <div styleName='step1content'>
                  <Translate value={`${prefix}.threeStepsTo`} /><br />
                  <strong><Translate styleName='green' value={`${prefix}.enable`} /> <Translate value={`${prefix}.mobileApp`} /></strong><br />
                  <Translate value={`${prefix}.based2fa`} />
                </div>
              </div>
            </div>

            <div styleName='step'>
              <div styleName='stepBullet'>2</div>
              <div styleName='stepCol1'>
                <Translate value={`${prefix}.step2Description`} />
                <div styleName='checkbox'>
                  <Checkbox label={<Translate value={`${prefix}.iHaveWrittenCode`} />} />
                </div>
              </div>
              <div styleName='stepCol2 highlight step2'>
                <div styleName='step2title'><Translate value={`${prefix}.yourBackupCode`} /></div>
                <div styleName='step2code'>TODO CODE</div>
              </div>
            </div>

            <div styleName='step'>
              <div styleName='stepBullet'>3</div>
              <div styleName='stepCol1'><Translate value={`${prefix}.step3Description`} dangerousHTML /></div>
              <div styleName='stepCol2 step3'>
                <div styleName='step3qrCode'>QR CODE</div>
                <div styleName='step3content'>
                  <div styleName='highlight step3details'><Translate value={`${prefix}.step3details`} dangerousHTML /></div>
                  <div styleName='step3code'>
                    <TextField
                      placeholder='123456'
                      label={<Translate value={`${prefix}.authCode`} />}
                      inputStyle={{
                        letterSpacing: 2.4,
                        fontSize: 24,
                        textAlign: 'center',
                      }}
                      floatingLabelFixed
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div styleName='actions'>
            <Button
              label={<Translate value={`${prefix}.enable2FA`} />}
              styleName='action'
              onClick={this.handleEnable2FA}
            />
          </div>
        </div>
      </div>
    )
  }
}
