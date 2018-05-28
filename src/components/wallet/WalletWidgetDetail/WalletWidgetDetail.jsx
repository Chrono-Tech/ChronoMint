/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import TokenModel from 'models/tokens/TokenModel'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { modalsOpen } from 'redux/modals/actions'
import { Translate } from 'react-redux-i18n'
import { TOKEN_ICONS } from 'assets'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import Button from 'components/common/ui/Button/Button'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { integerWithDelimiter } from 'utils/formatter'
import ReceiveTokenModal from 'components/dashboard/ReceiveTokenModal/ReceiveTokenModal'
import TokensCollection from 'models/tokens/TokensCollection'
import MainWalletModel from 'models/wallet/MainWalletModel'
import { getMainTokenForWalletByBlockchain } from 'redux/tokens/selectors'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import SendTokens from 'components/dashboard/SendTokens/SendTokens'
import DepositTokensModal from 'components/dashboard/DepositTokens/DepositTokensModal'
import EditManagersDialog from 'components/dialogs/wallet/EditOwnersDialog/EditOwnersDialog'
import EditSignaturesDialog from 'components/dialogs/wallet/EditSignaturesDialog/EditSignaturesDialog'
import Moment from 'components/common/Moment'
import DerivedWalletModel from 'models/wallet/DerivedWalletModel'
import SubIconForWallet from '../SubIconForWallet/SubIconForWallet'
import './WalletWidgetDetail.scss'
import { prefix } from './lang'

function mapStateToProps (state, ownProps) {
  return {
    token: getMainTokenForWalletByBlockchain(ownProps.blockchain)(state),
    tokens: state.get(DUCK_TOKENS),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    send: (tokenId, blockchain, address, wallet) => {
      dispatch(modalsOpen({
        component: SendTokens,
        props: {
          isModal: true,
          token: tokenId,
          blockchain,
          address,
          wallet,
        },
      }))
    },
    receive: (blockchain) => dispatch(modalsOpen({
      component: ReceiveTokenModal,
      props: {
        blockchain,
      },
    })),
    deposit: (props) => dispatch(modalsOpen({ component: DepositTokensModal, props })),
    openEditManagersDialog: (wallet) => dispatch(modalsOpen({
      component: EditManagersDialog,
      props: { wallet },
    })),
    openEditSignaturesDialog: (wallet) => dispatch(modalsOpen({
      component: EditSignaturesDialog,
      props: { wallet },
    })),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletWidgetDetail extends PureComponent {
  static propTypes = {
    blockchain: PropTypes.string,
    wallet: PropTypes.oneOfType([
      PropTypes.instanceOf(MainWalletModel),
      PropTypes.instanceOf(MultisigWalletModel),
      PropTypes.instanceOf(DerivedWalletModel),
    ]),
    address: PropTypes.string,
    token: PropTypes.instanceOf(TokenModel),
    tokens: PropTypes.instanceOf(TokensCollection),
    walletInfo: PropTypes.shape({
      address: PropTypes.string,
      balance: PropTypes.number,
      tokens: PropTypes.array,
    }),
    send: PropTypes.func,
    receive: PropTypes.func,
    deposit: PropTypes.func,
    openEditManagersDialog: PropTypes.func,
    openEditSignaturesDialog: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      isShowAll: false,
    }
  }

  handleEditOwners = () => this.props.openEditManagersDialog(this.props.wallet)

  handleEditSignatures = () => this.props.openEditSignaturesDialog(this.props.wallet)

  handleSend = () => {
    this.props.send(this.props.token.id(), this.props.blockchain, this.props.address, this.props.wallet)
  }

  handleReceive = () => {
    this.props.receive(this.props.blockchain)
  }

  handleDeposit = () => {
    this.props.deposit()
  }

  handleChangeShowAll = () => {
    this.setState({
      isShowAll: !this.state.isShowAll,
    })
  }

  getTokensList = () => {
    return this.state.isShowAll ? this.props.walletInfo.tokens : this.props.walletInfo.tokens.slice(0, 2)
  }

  getOwnersList = () => {
    const ownersList = this.props.wallet.owners().items()

    if (ownersList.length <= 3) {
      return (
        <div styleName='owners-amount'>
          <div styleName='owners-list'>
            {ownersList.map((owner) => {
              return (
                <div styleName='owner-icon'>
                  <div styleName='owner' className='chronobank-icon' title={owner.address()}>profile</div>
                </div>
              )
            })
            }
          </div>
        </div>
      )
    }

    return (
      <div styleName='owners-amount'>
        <div styleName='owners-list'>
          {ownersList.slice(0, 2).map((owner) => {
            return (
              <div styleName='owner-icon'>
                <div styleName='owner' className='chronobank-icon' title={owner.address()}>profile</div>
              </div>
            )
          })
          }
          <div styleName='owner-counter'>
            <div styleName='counter'>+{ownersList.length - 2}</div>
          </div>
        </div>
      </div>
    )
  }

  getWalletName = () => {
    const { wallet, blockchain, address } = this.props
    const name = wallet instanceof MainWalletModel ? wallet.name(blockchain, address) : wallet.name()
    if (name) {
      return name
    }

    let key = null
    if (this.isMySharedWallet()) {
      key = 'sharedWallet'
    } else if (this.isLockedWallet()) {
      key = 'lockedWallet'
    } else if (wallet instanceof DerivedWalletModel) {
      if (wallet.customTokens()) {
        key = 'customWallet'
      } else {
        key = 'additionalStandardWallet'
      }
    } else {
      key = 'standardWallet'
    }

    return <Translate value={`${prefix}.${key}`} />
  }

  getAmountList = () => {
    const walletInfo = this.props.walletInfo

    if (walletInfo.tokens.length < 3) {
      return null
    }

    const firstToken = walletInfo.tokens[0]

    return (
      <div styleName='amount-list-container'>
        <div styleName='amount-list'>
          <span styleName='amount-text'>
            {`${firstToken.symbol} ${firstToken.amount.toFixed(2)}`}, {`+ ${walletInfo.tokens.length - 1} more`}
          </span>
        </div>
        <div styleName='show-all'>
          <span styleName='show-all-a' onTouchTap={this.handleChangeShowAll}>{!this.state.isShowAll ? 'Show All' : 'Show less'}</span>
        </div>
      </div>
    )
  }

  isMySharedWallet = () => {
    return this.props.wallet.isMultisig() && !this.props.wallet.isTimeLocked()
  }

  isMainWallet = () => {
    return this.props.wallet.isMultisig() && this.props.wallet.isTimeLocked()
  }

  isLockedWallet = () => {
    return this.props.wallet.isMultisig() && this.props.wallet.isTimeLocked()
  }

  render () {
    const { address, token, blockchain, walletInfo, wallet } = this.props

    if (walletInfo.balance === null || walletInfo.tokens.length <= 0 || !wallet) {
      return null
    }
    const tokensList = this.getTokensList() || []

    return (
      <div styleName='header-container' className='WalletWidgetDetail__root'>
        <h1 styleName='header-text'><Translate value={`${prefix}.walletTitle`} title={blockchain} /></h1>
        <div styleName='wallet-list-container'>
          <div styleName='wallet-container'>
            <div styleName='body'>
              <div styleName='token-container'>
                {blockchain === BLOCKCHAIN_ETHEREUM && <SubIconForWallet wallet={wallet} />}
                <div styleName='token-icon'>
                  <IPFSImage styleName='image' multihash={token.icon()} fallback={TOKEN_ICONS[token.symbol()]} />
                </div>
              </div>
              <div styleName='content-container'>
                <div styleName='address-title'>
                  <h3>{this.getWalletName()}</h3>
                  <span styleName='address-address'>{address}</span>
                </div>
                <div styleName='token-amount'>
                  <div styleName='crypto-amount'>
                    {tokensList.length === 1
                      ? (
                        <div>
                          <div>{tokensList[0].symbol} {integerWithDelimiter(tokensList[0].amount.toFixed(2), true)}</div>
                          <div styleName='amountSubTitle'>USD {integerWithDelimiter(tokensList[0].amountPrice.toFixed(2), true)}</div>
                        </div>
                      )
                      : (
                        <div>
                          <div>USD {integerWithDelimiter(walletInfo.balance.toFixed(2), true)}</div>
                          <div styleName='tokensSubTitle'>
                            <Translate value={`${prefix}.tokensTitle`} count={tokensList.length} />
                            {wallet.isMultisig() ? <span>, <Translate value={`${prefix}.ownersTitle`} count={wallet.owners().size()} /></span> : null}
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {wallet.isTimeLocked() && (
                  <div styleName='unlockDateWrapper'>
                    <Translate value={`${prefix}.unlockDate`} /> <Moment data={wallet.releaseTime()} format='HH:mm, Do MMMM YYYY' />
                  </div>
                )}

              </div>
            </div>
            <div styleName='footer'>
              <div styleName='pendingOperations'>
                {wallet.isMultisig() && (
                  <div styleName='pendingOperationsCount'>
                    <Translate value={`${prefix}.pending`} count={wallet.pendingTxList().size()} />
                  </div>
                )}
              </div>
              <div styleName='actions-container'>
                <div styleName='action'>
                  <Button
                    disabled={false}
                    type='submit'
                    label={<Translate value={`${prefix}.sendButton`} />}
                    onTouchTap={this.handleSend}
                  />
                </div>
                <div styleName='action'>
                  <Button
                    disabled={false}
                    type='submit'
                    label={<Translate value={`${prefix}.receiveButton`} />}
                    onTouchTap={this.handleReceive}
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
                      onTouchTap={this.handleDeposit}
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
