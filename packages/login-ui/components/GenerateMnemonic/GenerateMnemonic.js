/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { MuiThemeProvider } from 'material-ui'
import React, { Component } from 'react'
import { Button } from '../../settings'
import { initMnemonicPage, navigateToConfirmMnemonicPage } from '@chronobank/login/redux/network/actions'

import PrintIcon from 'assets/img/icons/print-white.svg'

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

  componentDidMount(){
    this.props.initMnemonicPage()
  }

  navigateToConfirmPage(){
    this.props.navigateToConfirmPage()
  }

  render () {
    return (
      <MuiThemeProvider>
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
              <div styleName='passPhrase'>{ this.props.mnemonic }</div>
              <div styleName='printButtonWrapper'>
                <div styleName='printButton' onClick={() => {}}>
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
      </MuiThemeProvider>
    )
  }
}
