/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Button } from 'components'
import web3Converter from 'utils/Web3Converter'
import React, { PureComponent } from 'react'
import { getGasPriceMultiplier } from 'redux/session/selectors'
import { push } from 'react-router-redux'
import { change, Field, formValueSelector, reduxForm } from 'redux-form/immutable'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { Slider } from 'redux-form-material-ui'
import { FEE_RATE_MULTIPLIER, goToWallets } from 'redux/mainWallet/actions'
import PropTypes from 'prop-types'
import TWO_FA_LOGO_PNG from 'assets/img/2fa/2-fa.png'
import TokenValue from 'components/common/TokenValue/TokenValue'
import Preloader from 'components/common/Preloader/Preloader'
import { create2FAWallet, DUCK_MULTISIG_WALLET, estimateGasFor2FAForm, FORM_2FA_STEPS, FORM_2FA_WALLET } from 'redux/multisigWallet/actions'
import OwnerCollection from 'models/wallet/OwnerCollection'
import OwnerModel from 'models/wallet/OwnerModel'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import { DUCK_SESSION } from 'redux/session/actions'
import { prefix } from './lang'
import './TwoFaWalletForm.scss'

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_2FA_WALLET)
  const feeMultiplier = selector(state, 'feeMultiplier')
  const step = selector(state, 'step')
  const { account } = state.get(DUCK_SESSION)
  const check2FAChecked = state.get(DUCK_MULTISIG_WALLET).twoFAConfirmed()

  return {
    check2FAChecked,
    step,
    account,
    feeMultiplier,
    initialValues: {
      step: FORM_2FA_STEPS[0],
      feeMultiplier: feeMultiplier || getGasPriceMultiplier(BLOCKCHAIN_ETHEREUM)(state),
    },
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleGoWallets: () => dispatch(goToWallets()),
    handleGoTo2FA: () => dispatch(push('/2fa')),
    onSubmit: (values, dispatch, props) => {
      // owners
      let ownersCollection = new OwnerCollection()
      ownersCollection = ownersCollection.add(new OwnerModel({
        address: props.account,
      }))

      // date
      let releaseTime = new Date(0)

      const wallet = new MultisigWalletModel({
        ...props.initialValues.toJS(),
        ...values.toJS(),
        releaseTime,
        owners: ownersCollection,
      })

      dispatch(create2FAWallet(wallet, values.get('feeMultiplier')))
      dispatch(change(FORM_2FA_WALLET, 'step', FORM_2FA_STEPS[1]))
    },
    onSubmitSuccess: (a, b, c, d) => {
      // eslint-disable-next-line
      console.log('onSubmitSuccess', a, b, c, d)

    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_2FA_WALLET })
export default class TwoFaWalletForm extends PureComponent {
  static propTypes = {
    check2FAChecked: PropTypes.bool,
    handleSubmit: PropTypes.func,
    account: PropTypes.string,
    gasPriceMultiplier: PropTypes.number,
    feeMultiplier: PropTypes.number,
    handleGoWallets: PropTypes.func,
    handleGoTo2FA: PropTypes.func,
    dispatch: PropTypes.func,
    step: PropTypes.string,
  }

  constructor () {
    super(...arguments)

    this.state = {}
  }

  componentWillReceiveProps (newProps) {
    if (newProps.feeMultiplier > 0 && newProps.feeMultiplier !== this.props.feeMultiplier) {
      this.handleGetGasPrice(newProps.account, newProps.feeMultiplier)
    }
  }

  handleGetGasPrice = (account: string, feeMultiplier: number) => {
    clearTimeout(this.timeout)
    this.setState({ isFeeLoading: true })
    this.timeout = setTimeout(() => {
      estimateGasFor2FAForm(
        account,
        feeMultiplier,
        (error, { gasFee, gasPrice }) => {
          if (!error) {
            this.setState({ gasFee, gasPrice, isFeeLoading: false })
          } else {
            // eslint-disable-next-line
            console.log(error)
          }
        },
        feeMultiplier,
      )
    }, 1000)
  }

  renderFee () {
    if (this.state.isFeeLoading) {
      return <span styleName='feeLoaderContainer'><Preloader size={12} thickness={1.5} /></span>
    }
    if (this.state.gasFee) {
      return (
        <span>{`ETH ${web3Converter.fromWei(this.state.gasFee, 'wei').toString()} (≈USD `}
          <TokenValue renderOnlyPrice onlyPriceValue value={this.state.gasFee} />{')'}
        </span>
      )
    }
    return null
  }

  renderFormStep () {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <div styleName='title'><Translate value={`${prefix}.title`} /></div>
        <div styleName='description'><Translate value={`${prefix}.description`} /></div>
        <div styleName='slider'>
          <div styleName='tagsWrap'>
            <div><Translate value={`${prefix}.slow`} /></div>
            <div><Translate value={`${prefix}.fast`} /></div>
          </div>
          <Field
            component={Slider}
            sliderStyle={{ marginBottom: 0, marginTop: 5 }}
            name='feeMultiplier'
            {...FEE_RATE_MULTIPLIER}
          />
        </div>

        <div styleName='transactionFee'>
          <span styleName='title'>
            <Translate value={`${prefix}.transactionFee`} />
          </span> &nbsp;
          <span styleName='description'>
            {this.renderFee()}
            <div styleName='gweiMultiplier'>
              <Translate value={`${prefix}.averageFee`} multiplier={this.props.feeMultiplier} />
            </div>
          </span>
        </div>

        <div styleName='actions'>
          <div />
          <Button type='submit' label={<Translate value={`${prefix}.proceed`} />} />
        </div>
      </form>
    )
  }

  renderWaitStep () {
    return (
      <div>
        <div styleName='title'><Translate value={`${prefix}.waitTitle`} /></div>
        <div styleName='description'><Translate value={`${prefix}.waitDescription`} /></div>

        <div styleName='actions'>
          <div styleName='preloader'>
            <Preloader big />
          </div>
          <Button label={<Translate value={`${prefix}.goToMyWallets`} />} onTouchTap={this.props.handleGoWallets} />
        </div>
      </div>
    )
  }

  renderSuccessStep () {
    return (
      <div>
        <div styleName='title'><Translate value={`${prefix}.successTitle`} /></div>
        <div styleName='description'><Translate value={`${prefix}.successDescription`} /></div>

        <div styleName='actions'>
          <div />
          {this.props.check2FAChecked
            ? <Button label={<Translate value={`${prefix}.goToMyWallets`} />} onTouchTap={this.props.handleGoWallets} />
            : <Button label={<Translate value={`${prefix}.proceed`} />} onTouchTap={this.props.handleGoTo2FA} />}
        </div>
      </div>
    )
  }

  renderStep () {
    switch (this.props.step) {
      case FORM_2FA_STEPS[2]:
        return this.renderSuccessStep()
      case FORM_2FA_STEPS[1]:
        return this.renderWaitStep()
      default:
        return this.renderFormStep()
    }
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='img'><img src={TWO_FA_LOGO_PNG} alt='2 fa logo' /></div>
        {this.renderStep()}
      </div>
    )
  }
}
