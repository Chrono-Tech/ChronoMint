/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { modalsOpen } from '@chronobank/core/redux/modals/actions'
import { Translate } from 'react-redux-i18n'
import { TOKEN_ICONS } from 'assets'
import Button from 'components/common/ui/Button/Button'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { getMainTokenForWalletByBlockchain } from '@chronobank/core/redux/tokens/selectors'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/core/dao/constants'
import Moment from 'components/common/Moment'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import MultisigEthWalletModel from '@chronobank/core/models/wallet/MultisigEthWalletModel'
import { removeWalletAndNavigateToWallets } from 'redux/ui/thunks'
import SubIconForWallet from '../SubIconForWallet/SubIconForWallet'
import './WalletWidgetDetail.scss'
import { prefix } from './lang'
import WalletMainCoinBalance from '../WalletWidget/WalletMainCoinBalance'
import WalletName from '../WalletName/WalletName'
import WalletToken from '../WalletToken/WalletToken'

function mapStateToProps (state, ownProps) {
  return {
    token: getMainTokenForWalletByBlockchain(ownProps.wallet.blockchain)(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    send: (token, wallet) => {
      dispatch(modalsOpen({
        componentName: 'SendTokens',
        props: {
          wallet,
          isModal: true,
          tokenSymbol: token,
        },
      }))
    },
    receive: (wallet) => dispatch(modalsOpen({
      componentName: 'ReceiveTokenModal',
      props: { wallet },
    })),
    removeEthMultisig: (wallet) => dispatch(removeWalletAndNavigateToWallets(wallet)),
    deposit: (props) => dispatch(modalsOpen({
      componentName: 'DepositTokensModal',
      props,
    })),
    openEditManagersDialog: (wallet) => dispatch(modalsOpen({
      componentName: 'EditManagersDialog',
      props: { wallet },
    })),
    openEditSignaturesDialog: (wallet) => dispatch(modalsOpen({
      componentName: 'EditSignaturesDialog',
      props: { wallet },
    })),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletWidgetDetail extends PureComponent {
  static propTypes = {
    wallet: PropTypes.oneOfType([PropTypes.instanceOf(WalletModel), PropTypes.instanceOf(MultisigEthWalletModel)]),
    token: PropTypes.instanceOf(TokenModel),
    send: PropTypes.func,
    receive: PropTypes.func,
    deposit: PropTypes.func,
    removeEthMultisig: PropTypes.func,
  }

  handleSend = (wallet) => () => {
    this.props.send(this.props.token.id(), wallet)
  }

  handleReceive = () => {
    this.props.receive(this.props.wallet)
  }

  handleDeposit = () => {
    this.props.deposit()
  }

  handleRemoveEthMultisig = () => {
    this.props.removeEthMultisig(this.props.wallet)
  }

  render () {
    const { token, wallet } = this.props
    const tokenIsFetched = (token && token.isFetched())

    return (
      <div styleName='header-container' className='WalletWidgetDetail__root'>
        <div styleName='wallet-list-container'>
          <div styleName='wallet-container'>
            <div styleName='body'>
              <WalletToken
                blockchain={wallet.blockchain}
                wallet={wallet}
                token={token}
              />
              <div styleName='token-container'>
                {wallet.blockchain === BLOCKCHAIN_ETHEREUM && <SubIconForWallet wallet={wallet} />}
                <div styleName='token-icon'>
                  <IPFSImage styleName='image' multihash={token.icon()} fallback={TOKEN_ICONS[token.symbol()] || TOKEN_ICONS.DEFAULT} />
                </div>
              </div>
              <div styleName='content-container'>
                <div styleName='address-title'>
                  <h3><WalletName wallet={wallet} /></h3>
                  <span styleName='address-address'>{wallet.address}</span>
                </div>
                {tokenIsFetched
                  ? <WalletMainCoinBalance wallet={wallet} />
                  : (
                    <span styleName='noToken'>
                      <Translate value={`${prefix}.tokenNotAvailable`} />
                    </span>
                  )}

                {wallet.isTimeLocked && (
                  <div styleName='unlockDateWrapper'>
                    <Translate value={`${prefix}.unlockDate`} /> <Moment data={wallet.releaseTime} format='HH:mm, Do MMMM YYYY' />
                  </div>
                )}

              </div>
            </div>
            <div styleName='footer'>
              <div styleName='pendingOperations'>
                {wallet.pendingCount > 0 && (
                  <div styleName='pendingOperationsCount'>
                    <Translate value={`${prefix}.pending`} count={wallet.pendingCount} />
                  </div>
                )}
              </div>
              <div styleName='actions-container'>
                <div styleName='action'>
                  <Button
                    disabled={!tokenIsFetched}
                    type='submit'
                    label={<Translate value={`${prefix}.sendButton`} />}
                    onClick={this.handleSend(wallet)}
                  />
                </div>
                <div styleName='action'>
                  <Button
                    disabled={!tokenIsFetched}
                    type='submit'
                    label={<Translate value={`${prefix}.receiveButton`} />}
                    onClick={this.handleReceive}
                  />
                </div>
                {/*blockchain === BLOCKCHAIN_ETHEREUM && (
                  <div styleName='action'>
                    <Button
                      disabled={false}
                      flat
                      styleName='depositTokensButton'
                      type='submit'
                      label={<Translate value={`${prefix}.depositButton`} />}
                      onClick={this.handleDeposit}
                    />
                  </div>
                )*/}
                {/*wallet.isMultisig && (
                  <div styleName='action'>
                    <Button
                      type='submit'
                      label={<Translate value={`${prefix}.removeButton`} />}
                      onClick={this.handleRemoveEthMultisig}
                    />
                  </div>
                )*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
