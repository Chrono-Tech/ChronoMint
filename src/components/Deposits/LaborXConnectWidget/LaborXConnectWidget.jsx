/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import Button from 'components/common/ui/Button/Button'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { ETH, TIME, LHT } from '@chronobank/core/dao/constants'
import { getDeposit } from '@chronobank/core/redux/assetsHolder/selectors'
import { modalsOpen } from '@chronobank/core/redux/modals/actions'
import {
  getLXActiveSwapsCount,
  getMainLaborHourWallet,
  getMiningParams,
  getLXToken, getLXDeposit, getLXLockedDeposit,
} from '@chronobank/core/redux/laborHour/selectors/mainSelectors'
import { integerWithDelimiter } from '@chronobank/core/utils/formatter'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import Amount from '@chronobank/core/models/Amount'
import { obtainAllOpenSwaps } from '@chronobank/core/redux/laborHour/thunks'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { FORM_LABOR_X_CONNECT_SETTINGS } from 'components/constants'
import TokenValueSimple from 'components/common/TokenValueSimple/TokenValueSimple'
import { getMainEthWallet } from '@chronobank/core/redux/wallets/selectors/models'
import PropTypes from 'prop-types'
import LABOR_X_LOGO_SVG from 'assets/img/laborx-icon.svg'
import './LaborXConnectWidget.scss'
import { prefix } from './lang'

const WIDGET_FIRST_STEP = 'First'
const WIDGET_SECOND_STEP = 'Second'

function mapStateToProps (state) {
  const ethWallet = getMainEthWallet(state)
  const lhtWallet = getMainLaborHourWallet(state)
  const swapsCount = getLXActiveSwapsCount(state)
  const miningParams = getMiningParams(state)
  const lht = getLXToken(LHT)(state)
  const lxDeposit = getLXDeposit(lhtWallet.address)(state)
  const lxLockedDeposit = getLXLockedDeposit(lhtWallet.address)(state)
  return {
    deposit: getDeposit(TIME)(state),
    lhtWallet,
    ethWallet,
    swapsCount,
    miningParams,
    lht,
    lxDeposit,
    lxLockedDeposit,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleObtainAllOpenSwaps: () => dispatch(obtainAllOpenSwaps()),
    onOpenReceiveForm: (wallet, tokenId) =>
      dispatch(
        modalsOpen({
          componentName: 'ReceiveTokenModal',
          props: {
            wallet,
            tokenId,
          },
        }),
      ),
    onOpenDepositForm: () =>
      dispatch(modalsOpen({ componentName: 'DepositTokensModal' })),
    onOpenLXConnectForm: () =>
      dispatch(modalsOpen({ componentName: 'LaborXConnectModal' })),
    onOpenSettings: () =>
      dispatch(
        modalsOpen({
          componentName: 'LaborXConnectModal',
          props: {
            formName: FORM_LABOR_X_CONNECT_SETTINGS,
          },
        }),
      ),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class LaborXConnectWidget extends PureComponent {
  static propTypes = {
    onOpenReceiveForm: PropTypes.func,
    onOpenDepositForm: PropTypes.func,
    onOpenLXConnectForm: PropTypes.func,
    onOpenSettings: PropTypes.func,
    ethWallet: PropTypes.instanceOf(WalletModel),
    lhtWallet: PropTypes.instanceOf(WalletModel),
    deposit: PropTypes.instanceOf(Amount),
    swapsCount: PropTypes.number,
    handleObtainAllOpenSwaps: PropTypes.func,
    miningParams: PropTypes.shape({
      minDepositLimit: PropTypes.string,
      rewardsCoefficient: PropTypes.string,
      isCustomNode: PropTypes.bool,
    }),
    lht: PropTypes.instanceOf(TokenModel),
    lxDeposit: PropTypes.instanceOf(Amount),
    lxLockedDeposit: PropTypes.instanceOf(Amount),
  }

  constructor (props) {
    super(props)
    let step = WIDGET_FIRST_STEP
    if (props.lhtWallet.balances[TIME] && props.lhtWallet.balances[TIME].gt(0)) {
      step = WIDGET_SECOND_STEP
    }
    this.state = { step }
  }

  componentWillReceiveProps (newProps) {
    const isLXDeposit = newProps.lxDeposit && newProps.lxDeposit.gt(0)
    const isLXLockedDeposit = newProps.lxLockedDeposit && newProps.lxLockedDeposit.gt(0)
    const isLXBalance = newProps.lhtWallet.balances[TIME] && newProps.lhtWallet.balances[TIME].gt(0)
    if (isLXBalance || isLXDeposit || isLXLockedDeposit) {
      return this.setState({ step: WIDGET_SECOND_STEP })
    }
  }

  handleOpenReceiveForm = () => {
    const {
      ethWallet,
      deposit,
      onOpenDepositForm,
      onOpenReceiveForm,
      onOpenLXConnectForm,
    } = this.props
    const isHaveNotEth = !ethWallet.balances[ETH] || ethWallet.balances[ETH].lte(0)
    const isHaveNotTime = !ethWallet.balances[TIME] || ethWallet.balances[TIME].lte(0)

    // if usen don't have any tokens
    if (isHaveNotEth || isHaveNotTime) {
      return onOpenReceiveForm(this.props.ethWallet)
    }

    // if user don't have deposit
    if (deposit.lte(0)) {
      return onOpenDepositForm()
    }

    // for first step
    return onOpenLXConnectForm()
  }

  handleContinue = () => {
    return this.props.handleObtainAllOpenSwaps()
  }

  handleOpenSettings = () => {
    this.props.onOpenSettings()
  }

  renderFirstStep = () => {
    return (
      <div styleName='content-container'>
        <div styleName='title'>
          <Translate value={`${prefix}.title`} />
        </div>
        <div styleName='text'>
          <Translate value={`${prefix}.message`} />
        </div>
        <div styleName='text'>
          <Translate value={`${prefix}.messageSubTitle`} />
        </div>

        <div styleName='actions-container'>
          <div styleName='action'>
            <Button
              type='submit'
              label={<Translate value={`${prefix}.getStarted`} />}
              onClick={this.handleOpenReceiveForm}
            />
          </div>
        </div>
      </div>
    )
  }

  renderSecondStep = () => {
    const { miningParams, lxDeposit, lxLockedDeposit, lhtWallet } = this.props
    const { rewardsCoefficient } = miningParams
    const isLXDeposit = lxDeposit && lxDeposit.gt(0)
    const isLXLockedDeposit = lxLockedDeposit && lxLockedDeposit.gt(0)
    let renderBalance = lhtWallet.balances[TIME]
    if (isLXLockedDeposit) {
      renderBalance = lxLockedDeposit
    } else if (isLXDeposit) {
      renderBalance = lxDeposit
    }
    const isMiningOn = isLXLockedDeposit || isLXDeposit

    return (
      <div styleName='content-container'>
        <div styleName='title addressTittle'>
          <Translate value={`${prefix}.title`} />
        </div>
        <div styleName='address'>{this.props.lhtWallet.address}</div>

        <div styleName='balance'>
          {TIME}
          &nbsp;
          <TokenValueSimple
            value={renderBalance}
            fractionPrecision={8}
            withFraction
          />
          <br />
          balance
          <br />
          <TokenValueSimple
            value={lhtWallet.balances[TIME]}
            fractionPrecision={8}
            withFraction
          />
          <br />
          deposit
          <br />
          <TokenValueSimple
            value={lxDeposit}
            fractionPrecision={8}
            withFraction
          />
          <br />
          locked deposit
          <br />
          <TokenValueSimple
            value={lxLockedDeposit}
            fractionPrecision={8}
            withFraction
          />

        </div>

        <div styleName='infoList'>
          <div styleName='infoItem'>
            <div styleName='icon'>
              <div className='chronobank-icon' styleName={isMiningOn ? 'active' : ''}>
                {isMiningOn ? 'check-circle' : 'warning'}
              </div>
            </div>
            <div styleName='title'>
              {isMiningOn
                ? <Translate value={`${prefix}.miningON`} />
                : <Translate value={`${prefix}.miningOFF`} />
              }
            </div>
          </div>
          <div styleName='infoItem'>
            <div styleName='title'>
              Reward: LHT{' '}
              {integerWithDelimiter(
                this.props.lht.removeDecimals(renderBalance.mul(rewardsCoefficient)),
                true,
              )}{' '}
              / block
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderStep () {
    const steps = {
      [WIDGET_FIRST_STEP]: this.renderFirstStep,
      [WIDGET_SECOND_STEP]: this.renderSecondStep,
    }
    return steps[this.state.step] ? steps[this.state.step]() : null
  }

  render () {
    return (
      <div styleName='header-container'>
        <div styleName='wallet-list-container'>
          <div styleName='wallet-container'>
            {this.state.step === WIDGET_SECOND_STEP ? (
              <div styleName='settingsIcon'>
                <button
                  className='chronobank-icon'
                  onClick={this.handleOpenSettings}
                >
                  settings
                </button>
              </div>
            ) : null}
            <div styleName='token-container'>
              <div styleName='token-icon'>
                <IPFSImage styleName='imageIcon' fallback={LABOR_X_LOGO_SVG} />
              </div>
            </div>
            {this.renderStep()}
          </div>
        </div>
      </div>
    )
  }
}
