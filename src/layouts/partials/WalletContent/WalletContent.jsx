import { isTestingNetwork } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/actions'
import classNames from 'classnames'
import { DepositTokens, Points, SendTokens, TransactionsTable, WalletChanger, WalletPendingTransfers } from 'components'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { getAccountTransactions } from 'redux/mainWallet/actions'
import { initWalletManager } from 'redux/multisigWallet/actions'
import { getCurrentWallet } from 'redux/wallet/actions'

import './WalletContent.scss'

function prefix (token) {
  return `layouts.partials.WalletContent.${token}`
}

const CLASS_NAME_FULL_COL = 'col-xs-12 col-md-6 col-xl-4'
const CLASS_NAME_HALF_COL = 'col-xs-6 col-md-3 col-xl-2'

function mapStateToProps (state) {
  const network = state.get(DUCK_NETWORK)

  return {
    wallet: getCurrentWallet(state),
    selectedNetworkId: network.selectedNetworkId,
    selectedProviderId: network.selectedProviderId,
    isTesting: isTestingNetwork(network.selectedNetworkId, network.selectedProviderId),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getTransactions: (tokens) => dispatch(getAccountTransactions(tokens)),
    initWalletManager: () => dispatch(initWalletManager()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletContent extends Component {
  static propTypes = {
    getTransactions: PropTypes.func,
    wallet: PropTypes.object,
    isTesting: PropTypes.bool,
    selectedNetworkId: PropTypes.number,
    selectedProviderId: PropTypes.number,
    initWalletManager: PropTypes.func,
  }

  componentWillMount () {
    this.props.initWalletManager()
  }

  renderWalletsInstructions () {
    return (
      <div styleName='instructions'>
        <h3><Translate value='layouts.partials.WalletContent.youCanUseTheMultisignatureWallets' /></h3>
        <div styleName='instructionsDescription'>
          <p><Translate value='layouts.partials.WalletContent.walletsAreSmartContractsWhichManageAssets' /></p>
        </div>
      </div>
    )
  }

  renderDepositInstructions () {
    return (
      <div styleName='instructions'>
        <h3><Translate value={prefix('howToMakeTime')} /></h3>
        <div styleName='instructionsDescription'>
          {!this.props.isTesting ?
            <p><b><Translate value={prefix('depositTimeIsTemporarilyLimited')} /></b><br /><br /></p> : ''}
          <p><Translate value={prefix('toUseStakeholders')} /></p>
        </div>
        <Points>
          <Translate value={prefix('enterTheAmount')} />
          <Translate value={prefix('checkValueAndPress')} />
          <Translate value={prefix('waitUntilAllowance')} />
        </Points>
      </div>
    )
  }

  renderTransactionInstructions () {
    return (
      <div styleName='instructions'>
        <h3><Translate value={prefix('howToMakeATransfer')} /></h3>
        <div styleName='instructionsDescription'>
          <p><Translate value={prefix('ifYouPlanToMoveALargeAmountOfEther')} /></p>
        </div>
        <Points>
          <Translate value={prefix('enterTheAddressYouWouldLikeToSendTo')} />
          <Translate value={prefix('enterTheAmountYouWouldLikeToSend')} />
          <span>
            <Translate value={prefix('checkValuesAndPressSend')} /><br />
            <Translate value={prefix('ifYouWantToAllowAContract')} />
          </span>
        </Points>
      </div>
    )
  }

  render () {
    const { wallet } = this.props
    const isMultisig = wallet.isMultisig()

    return (
      <div styleName='root'>
        <div styleName='content'>
          <div className='WalletContent__grid'>
            <div className='row'>
              <div className={classNames(!isMultisig ? CLASS_NAME_FULL_COL : CLASS_NAME_HALF_COL)}>

                <div className='WalletContent__grid'>
                  <div className='row'>
                    <div
                      className={classNames(!isMultisig ? CLASS_NAME_HALF_COL : CLASS_NAME_FULL_COL)}
                      styleName='headLight'
                    >
                      <WalletChanger />
                    </div>
                    {!isMultisig && (
                      <div className={CLASS_NAME_HALF_COL}>
                        {this.renderWalletsInstructions()}
                      </div>
                    )}
                  </div>
                  <div className='row'>
                    <div
                      className={classNames(!isMultisig ? CLASS_NAME_HALF_COL : CLASS_NAME_FULL_COL)}
                      styleName='headLight'
                    >
                      <SendTokens />
                    </div>
                    {!isMultisig && (
                      <div className={CLASS_NAME_HALF_COL}>
                        {this.renderTransactionInstructions()}
                      </div>
                    )}
                  </div>
                </div>

              </div>
              {isMultisig && (
                <div className={CLASS_NAME_HALF_COL} styleName='headLight'>
                  <WalletPendingTransfers />
                </div>
              )}
            </div>

            {!isMultisig && (
              <div className='row'>
                <div className={CLASS_NAME_HALF_COL} styleName='headDark'>
                  <DepositTokens />
                </div>
                <div className={CLASS_NAME_HALF_COL}>
                  {this.renderDepositInstructions()}
                </div>
              </div>
            )}

            <div className='row'>
              <div className='col-md-6 col-xl-4'>
                <TransactionsTable
                  tokens={wallet.tokens()}
                  transactions={wallet.transactions()}
                  selectedNetworkId={this.props.selectedNetworkId}
                  selectedProviderId={this.props.selectedProviderId}
                  onLoadMore={() => this.props.getTransactions(wallet.tokens())}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
