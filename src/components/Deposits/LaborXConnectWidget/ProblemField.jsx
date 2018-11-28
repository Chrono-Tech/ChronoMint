/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import classnames from 'classnames'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from 'components/common/ui/Button/Button'
import { connect } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import { TIME } from '@chronobank/core/dao/constants'
import {
  getLXDeposit,
  getLXLMiningProcessingStatus,
  getLXLockedDeposit,
  getLXSwapsMtS,
  getLXSwapsStM,
  getLXToken,
  getMainLaborHourWallet,
  getMiningParams,
} from '@chronobank/core/redux/laborHour/selectors/mainSelectors'
import {
  obtainAllMainnetOpenSwaps,
  obtainAllLXOpenSwaps,
} from '@chronobank/core/redux/laborHour/thunks'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import Amount from '@chronobank/core/models/Amount'
import { fixTokensToMining } from '@chronobank/core/redux/laborHour/thunks/mainnetToSidechain'
import { fixTokensToMainnet } from '@chronobank/core/redux/laborHour/thunks/sidechainToMainnet'
import './LaborXConnectWidget.scss'
import { prefix } from './lang'
import Preloader from '../../common/Preloader/Preloader'

function mapStateToProps (state) {
  const lhtWallet = getMainLaborHourWallet(state)
  const mainnetSwaps = getLXSwapsMtS(state)
  const lxSwaps = getLXSwapsStM(state)
  const miningParams = getMiningParams(state)
  const lxDeposit = getLXDeposit(lhtWallet.address)(state)
  const lxLockedDeposit = getLXLockedDeposit(lhtWallet.address)(state)
  const processingStatus = getLXLMiningProcessingStatus(state)
  const timeToken = getLXToken(TIME)(state)

  return {
    lhtWallet,
    mainnetSwaps,
    lxSwaps,
    miningParams,
    lxDeposit,
    lxLockedDeposit,
    processingStatus,
    timeToken,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleObtainAllMainnetOpenSwaps: () => dispatch(obtainAllMainnetOpenSwaps()),
    handleObtainAllLXOpenSwaps: () => dispatch(obtainAllLXOpenSwaps()),
    onFixToMining: () => dispatch(fixTokensToMining()),
    onFixToMainnet: () => dispatch(fixTokensToMainnet()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ProblemField extends PureComponent {
  static propTypes = {
    lhtWallet: PropTypes.instanceOf(WalletModel),
    swapsCount: PropTypes.number,
    mainnetSwaps: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.number,
      swapId: PropTypes.string,
      isActive: PropTypes.bool,
      created: PropTypes.string,
    })),
    lxSwaps: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.number,
      swapId: PropTypes.string,
      isActive: PropTypes.bool,
      created: PropTypes.string,
    })),
    miningParams: PropTypes.shape({
      minDepositLimit: PropTypes.string,
      rewardsCoefficient: PropTypes.string,
      isCustomNode: PropTypes.bool,
    }),
    lxDeposit: PropTypes.instanceOf(Amount),
    lxLockedDeposit: PropTypes.instanceOf(Amount),
    handleObtainAllMainnetOpenSwaps: PropTypes.func,
    handleObtainAllLXOpenSwaps: PropTypes.func,
    timeToken: PropTypes.instanceOf(TokenModel),
    onFixToMining: PropTypes.func,
    onFixToMainnet: PropTypes.func,
    processingStatus: PropTypes.string,
  }

  constructor () {
    super(...arguments)
    this.state = {
      isOpen: false,
    }
  }

  handleOpenToggle = () => this.setState({ isOpen: !this.state.isOpen })

  handleFixToMining = () => {
    this.handleOpenToggle()
    this.props.onFixToMining()
  }

  handleFixToMainnet = () => {
    this.handleOpenToggle()
    this.props.onFixToMainnet()
  }

  render () {
    const {
      lxDeposit,
      lxLockedDeposit,
      lhtWallet,
      mainnetSwaps,
      lxSwaps,
      handleObtainAllLXOpenSwaps,
      handleObtainAllMainnetOpenSwaps,
      processingStatus,
      timeToken,
      miningParams,
    } = this.props
    const isLXDeposit = lxDeposit && lxDeposit.gt(0)
    const isLXLockedDeposit = lxLockedDeposit && lxLockedDeposit.gt(0)
    let undistributedValue = lhtWallet.balances[TIME]
    if (isLXLockedDeposit) {
      undistributedValue = undistributedValue.plus(lxDeposit)
    } else if (isLXDeposit) {
      undistributedValue = lhtWallet.balances[TIME]
    }
    return (
      <div>
        {
          processingStatus &&
          <div styleName='infoItem'>
            <div styleName='icon'>
              <div className='chronobank-icon'><Preloader /></div>
            </div>
            <div styleName='title'><Translate value={`${processingStatus}`} /></div>
          </div>
        }
        {
          mainnetSwaps.length > 0 &&
          <div styleName='infoItem'>
            <div styleName='icon'>
              <div className='chronobank-icon'>warning</div>
            </div>
            <div styleName='title'><Translate value={`${prefix}.unclosedSwapsMainnet`} count={mainnetSwaps.length} /></div>
            <div styleName='buttonWrapper'>
              <Button onClick={handleObtainAllMainnetOpenSwaps}><Translate value={`${prefix}.fix`} /></Button>
            </div>
          </div>
        }
        {
          lxSwaps.length > 0 &&
          <div styleName='infoItem'>
            <div styleName='icon'>
              <div className='chronobank-icon'>warning</div>
            </div>
            <div styleName='title'><Translate value={`${prefix}.unclosedSwapsLX`} count={lxSwaps.length} /></div>
            <div styleName='buttonWrapper'>
              <Button onClick={handleObtainAllLXOpenSwaps}>
                <Translate value={`${prefix}.fix`} />
              </Button>
            </div>
          </div>
        }
        {
          undistributedValue.gt(0) && !processingStatus &&
          <div styleName='infoItem'>
            <div styleName='icon'>
              <div className='chronobank-icon'>warning</div>
            </div>
            <div styleName='title'>
              <Translate value={`${prefix}.undistributed`} />: TIME {timeToken.removeDecimals(undistributedValue).toNumber()}
            </div>
            <div styleName='buttonWrapper'>
              <Button
                styleName={classnames({ 'openButton': this.state.isOpen })}
                onClick={this.handleOpenToggle}
              >
                <Translate value={`${prefix}.fix`} />
              </Button>

              <div styleName={classnames('menu', { 'open': this.state.isOpen })}>
                <button
                  styleName='item'
                  onClick={this.handleFixToMining}
                  disabled={miningParams.isCustomNode && !miningParams.delegateAddress}
                  title={miningParams.isCustomNode && !miningParams.delegateAddress
                    ? I18n.t(`${prefix}.openSettingsForm`)
                    : ''}
                >
                  <Translate value={`${prefix}.useForMining`} />
                </button>
                <button
                  styleName='item'
                  onClick={this.handleFixToMainnet}
                >
                  <Translate value={`${prefix}.sendToDeposit`} />
                </button>
              </div>

            </div>
          </div>
        }
      </div>
    )
  }
}
