/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Button from 'components/common/ui/Button/Button'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/core/dao/constants'
import { connect } from 'react-redux'
import { EOS } from '@chronobank/core/redux/eos/constants'
import { modalsOpen } from '@chronobank/core/redux/modals/actions'
import { TOKEN_ICONS } from 'assets'
import { Translate } from 'react-redux-i18n'
import './EOSWalletWidgetDetail.scss'
import EOSWalletMainCoinBalance from '../EOSWalletWidget/EOSWalletMainCoinBalance'
import SubIconForWallet from '../SubIconForWallet/SubIconForWallet'
import WalletName from '../WalletName/WalletName'
import { prefix } from './lang'

function mapDispatchToProps (dispatch) {
  return {
    send: (wallet) => {
      dispatch(modalsOpen({
        componentName: 'SendTokens',
        props: {
          wallet,
          isModal: true,
        },
      }))
    },
    receive: (wallet) => dispatch(modalsOpen({
      componentName: 'ReceiveTokenModal',
      props: { wallet },
    })),
  }
}

@connect(null, mapDispatchToProps)
export default class EOSWalletWidgetDetail extends PureComponent {
  static propTypes = {
    wallet: PropTypes.instanceOf(WalletModel),
    send: PropTypes.func,
    receive: PropTypes.func,
  }

  handleSend = (wallet) => () => {
    this.props.send(wallet)
  }

  handleReceive = () => {
    this.props.receive(this.props.wallet)
  }

  render () {
    const { wallet } = this.props
    const isBalancesLoaded = Object.values(wallet.balances).length

    return (
      <div styleName='header-container' className='WalletWidgetDetail__root'>
        <div styleName='wallet-list-container'>
          <div styleName='wallet-container'>
            <div styleName='body'>
              <div styleName='token-container'>
                {wallet.blockchain === BLOCKCHAIN_ETHEREUM && <SubIconForWallet wallet={wallet} />}
                <div styleName='token-icon'>
                  <IPFSImage styleName='image' fallback={TOKEN_ICONS[EOS]} />
                </div>
              </div>
              <div styleName='content-container'>
                <div styleName='address-title'>
                  <h3><WalletName wallet={wallet} /></h3>
                  <span styleName='address-address'>{wallet.address}</span>
                </div>

                {isBalancesLoaded > 0
                  ? <EOSWalletMainCoinBalance wallet={wallet} />
                  : (<span styleName='noToken'> <Translate value={`${prefix}.tokenNotAvailable`} /> </span>)}

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
                    type='submit'
                    label={<Translate value={`${prefix}.sendButton`} />}
                    onClick={this.handleSend(wallet)}
                  />
                </div>
                <div styleName='action'>
                  <Button
                    type='submit'
                    label={<Translate value={`${prefix}.receiveButton`} />}
                    onClick={this.handleReceive}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
