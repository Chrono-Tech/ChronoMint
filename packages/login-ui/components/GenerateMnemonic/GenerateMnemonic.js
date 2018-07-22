/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import QRCode from 'qrcode'
import { initMnemonicPage, navigateToConfirmMnemonicPage } from '@chronobank/login/redux/network/actions'
import PrintIcon from 'assets/img/icons/print-white.svg'
import LogoPrintVersion from 'assets/img/logo-chrono-wallet-bw.svg'
import { Button } from '../../settings'

import './GenerateMnemonic.scss'

function mapStateToProps (state, ownProps) {

  return {
    mnemonic: state.get('network').newAccountMnemonic,
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    initMnemonicPage: () => dispatch(initMnemonicPage()),
    navigateToConfirmPage: () => dispatch(navigateToConfirmMnemonicPage()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class MnemonicPage extends Component {
  static propTypes = {
    mnemonic: PropTypes.string,
    initMnemonicPage: PropTypes.func,
    navigateToConfirmPage: PropTypes.func,
  }

  static defaultProps = {
    mnemonic: '',
  }

  componentDidMount () {
    this.props.initMnemonicPage()
  }

  navigateToConfirmPage () {
    this.props.navigateToConfirmPage()
  }

  showMnemonicPrintVersion () {
    const element = (
      <div styleName='print-wrapper'>
        <img styleName='print-logo' src={LogoPrintVersion} alt='' />
        <div styleName='print-title'>Your back-up phrase<br />(Mnemonic Key)</div>
        <div styleName='print-mnemonic'>
          radio cat potato tree android rotor influence chrono
          adelaide chrome collective fire
        </div>
        <div styleName='print-qr-description'>
          Scan this QR code to speed up
          <br />
          entering process
        </div>
        <div id='print-qr-code'></div>
      </div>
    )

    this.renderPrintVersionContent(element)
    new QRCode(document.getElementById('print-qr-code'), {
      text: 'radio cat potato tree android rotor influence chrono adelaide chrome collective fire',
      width: 230,
      height: 230,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

    window.print()
  }

  onAfterPrint () {
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
  }

  renderPrintVersionContent (content) {
    const printVersionContainerId = 'generate-mnemonic-container'
    let printVersionWrapper = document.createElement('div')
    printVersionWrapper.setAttribute('id', printVersionContainerId)

    document.body.appendChild(printVersionWrapper)

    window.onafterprint = () => {
      printVersionWrapper.parentNode.removeChild(printVersionWrapper)
    }

    ReactDOM.render(content, document.getElementById(printVersionContainerId))
  }

  render () {
    return (
      <div styleName='wrapper'>
        <div>
          <div styleName='page-title'>
            <Translate value='GenerateMnemonic.title' />
          </div>

          <p styleName='description'>
            <Translate value='GenerateMnemonic.description' />
            <Translate value='GenerateMnemonic.descriptionExtra' />
          </p>

          <div styleName='passPhraseWrapper'>
            <div styleName='passPhrase'>{this.props.mnemonic}</div>
            <div styleName='printButtonWrapper'>
              <div styleName='printButton' onClick={() => this.showMnemonicPrintVersion()}>
                <img src={PrintIcon} alt='' />
              </div>
            </div>
          </div>

          <div styleName='infoBlock'>
            <div styleName='infoBlockHeader'>
              <Translate value='GenerateMnemonic.infoHeader' />
            </div>

            <ol styleName='infoBlockList'>
              <li>
                <p styleName='listItemContent'>
                  <b>
                    <Translate value='GenerateMnemonic.infoContentPart1' />
                  </b>
                  &nbsp;
                  <Translate value='GenerateMnemonic.infoContentPart2' />
                </p>
              </li>

              <li>
                <p styleName='listItemContent'>
                  <b>
                    <Translate value='GenerateMnemonic.infoContentPart3' />
                  </b>
                  &nbsp;
                  <Translate value='GenerateMnemonic.infoContentPart4' />
                </p>
              </li>
            </ol>
          </div>

          <div styleName='actions'>
            <Button
              styleName='submit'
              buttonType='login'
              onClick={this.navigateToConfirmPage.bind(this)}
            >
              <Translate value='GenerateMnemonic.login' />
            </Button>
          </div>

          <div styleName='progressBlock'>
            <div styleName='progressPoint' />
            <div styleName='progressPoint' />
            <div styleName='progressPoint progressPointInactive' />
          </div>
        </div>
      </div>
    )
  }
}
