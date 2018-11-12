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
  getMainLaboborHourWallet,
  getDepositParams,
  getLXToken,
} from '@chronobank/core/redux/laborHour/selectors/mainSelectors'
import { integerWithDelimiter } from '@chronobank/core/utils/formatter'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import Amount from '@chronobank/core/models/Amount'
import { obtainAllOpenSwaps } from '@chronobank/core/redux/laborHour/thunks'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { FORM_LABOR_X_CONNECT_SETTINGS } from 'components/constants'
import TokenValueSimple from 'components/common/TokenValueSimple/TokenValueSimple'
import PropTypes from 'prop-types'
import LABOR_X_LOGO_SVG from 'assets/img/laborx-icon.svg'
import './LaborXConnectWidget.scss'
import { prefix } from './lang'

const WIDGET_FIRST_STEP = 'First'
const WIDGET_SECOND_STEP = 'Second'
const WIDGET_THIRD_STEP = 'Third'

function mapStateToProps (state) {
  const wallet = getMainLaboborHourWallet(state)
  const swapsCount = getLXActiveSwapsCount(state)
  const depositParams = getDepositParams(state)
  const lht = getLXToken(LHT)(state)
  return {
    deposit: getDeposit(TIME)(state),
    wallet,
    swapsCount,
    depositParams,
    lht,
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
        })
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
        })
      ),
  }
}

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class LaborXConnectWidget extends PureComponent {
  static propTypes = {
    onOpenReceiveForm: PropTypes.func,
    onOpenDepositForm: PropTypes.func,
    onOpenLXConnectForm: PropTypes.func,
    onOpenSettings: PropTypes.func,
    wallet: PropTypes.instanceOf(WalletModel),
    deposit: PropTypes.instanceOf(Amount),
    swapsCount: PropTypes.number,
    handleObtainAllOpenSwaps: PropTypes.func,
    depositParams: PropTypes.objectOf(PropTypes.string),
    lht: PropTypes.instanceOf(TokenModel),
  }

  constructor (props) {
    super(props)
    let step = WIDGET_FIRST_STEP
    if (props.swapsCount > 0) {
      step = WIDGET_SECOND_STEP
    }
    this.state = { step }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.swapsCount > 0) {
      return this.setState({ step: WIDGET_SECOND_STEP })
    }
    if (
      newProps.wallet.balances[TIME] &&
      newProps.wallet.balances[TIME].gt(0)
    ) {
      return this.setState({ step: WIDGET_THIRD_STEP })
    }
  }

  handleOpenReceiveForm = () => {
    const {
      wallet,
      deposit,
      onOpenDepositForm,
      onOpenReceiveForm,
      onOpenLXConnectForm,
    } = this.props
    const isHaveNotEth = !wallet.balances[ETH] || wallet.balances[ETH].lte(0)
    const isHaveNotTime = !wallet.balances[TIME] || wallet.balances[TIME].lte(0)

    // if usen don't have any tokens
    if (isHaveNotEth || isHaveNotTime) {
      return onOpenReceiveForm(this.props.wallet)
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
    return (
      <div styleName='content-container'>
        <div styleName='title'>
          <Translate value={`${prefix}.title`} />
        </div>
        <div styleName='text'>
          <Translate value={`${prefix}.message2`} />
        </div>

        <div styleName='actions-container'>
          <div styleName='action'>
            <Button
              disabled={false}
              type='submit'
              label={<Translate value={`${prefix}.continue`} />}
              onClick={this.handleContinue}
            />
          </div>
        </div>
      </div>
    )
  }

  renderThirdStep = () => {
    const { rewardsCoefficient } = this.props.depositParams
    const balance = this.props.wallet.balances[TIME]
    return (
      <div styleName='content-container'>
        <div styleName='title addressTittle'>
          <Translate value={`${prefix}.title`} />
        </div>
        <div styleName='address'>{this.props.wallet.address}</div>

        <div styleName='balance'>
          {TIME}
          &nbsp;
          <TokenValueSimple
            value={balance}
            fractionPrecision={8}
            withFraction
          />
        </div>

        <div styleName='infoList'>
          <div styleName='infoItem'>
            <div styleName='icon'>
              <div className='chronobank-icon' styleName='active'>
                check-circle
              </div>
            </div>
            <div styleName='title'>Mining is ON (ChronoBank)</div>
          </div>
          <div styleName='infoItem'>
            <div styleName='title'>
              Reward: LHT{' '}
              {integerWithDelimiter(
                this.props.lht.removeDecimals(balance.mul(rewardsCoefficient)),
                true
              )}{' '}
              / block
            </div>
          </div>
          <div styleName='infoItem'>
            <div styleName='title'>Total rewards: LHT 0.04</div>
          </div>
        </div>
      </div>
    )
  }

  renderStep () {
    const steps = {
      [WIDGET_FIRST_STEP]: this.renderFirstStep,
      [WIDGET_SECOND_STEP]: this.renderSecondStep,
      [WIDGET_THIRD_STEP]: this.renderThirdStep,
    }
    return steps[this.state.step] ? steps[this.state.step]() : null
  }

  render () {
    return (
      <div styleName='header-container'>
        <div styleName='wallet-list-container'>
          <div styleName='wallet-container'>
            {this.state.step === WIDGET_THIRD_STEP ? (
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
