/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import Button from 'components/common/ui/Button/Button'
import TokenValue from 'components/common/TokenValue/TokenValue'
import React, { PureComponent } from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import Preloader from 'components/common/Preloader/Preloader'
import MultisigWalletPendingTxModel from '@chronobank/core/models/wallet/MultisigWalletPendingTxModel'
import Amount from '@chronobank/core/models/Amount'
import { confirmMultisigTx, revokeMultisigTx } from '@chronobank/core/redux/multisigWallet/actions'
import { modalsOpen } from '@chronobank/core/redux/modals/actions'
import MultisigEthWalletModel from '@chronobank/core/models/wallet/MultisigEthWalletModel'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'

import { prefix } from './lang'
import './PendingTxWidget.scss'

function mapDispatchToProps (dispatch) {

  return {
    revoke: (wallet, tx) => dispatch(revokeMultisigTx(wallet, tx)),
    confirm: (wallet, tx) => dispatch(confirmMultisigTx(wallet, tx)),
    enterCode: (wallet, tx) => dispatch(modalsOpen({
      componentName: 'TwoFaConfirmModal',
      props: {
        wallet,
        tx,
      },
    })),
  }
}

@connect(null, mapDispatchToProps)
export default class PendingTxWidget extends PureComponent {
  static propTypes = {
    wallet: PropTypes.oneOfType([PropTypes.instanceOf(WalletModel), PropTypes.instanceOf(MultisigEthWalletModel)]),
    revoke: PropTypes.func,
    confirm: PropTypes.func,
    enterCode: PropTypes.func,
  }

  handleRevoke = (wallet, item) => () => {
    this.props.revoke(wallet, item)
  }

  handleConfirm = (wallet, item) => () => {
    this.props.confirm(wallet, item)
  }

  handleEnterCode = (wallet, item) => () => {
    this.props.enterCode(wallet, item)
  }

  renderIcon (tx: MultisigWalletPendingTxModel) {
    const func = tx.decodedTx.funcName()
    let icon = null
    let styleName = ''
    switch (func) {
      case'transfer':
        icon = 'send'
        break
      case'addOwner':
        icon = 'profile'
        break
      case'removeOwner':
        icon = 'profile'
        styleName = 'redColor'
        break
      case'kill':
        icon = 'delete'
        break
      case'changeRequirement':
        icon = 'lock'
        break
    }
    return (
      <div styleName={classnames('iconWrapper', { [styleName]: styleName })}>
        <i className='chronobank-icon'>{icon}</i>
      </div>
    )
  }

  renderRow = (wallet) => (item: MultisigWalletPendingTxModel) => {
    const isConfirmed = item.isConfirmed

    return (
      <div styleName='row' key={item.id}>
        <div styleName='rowTable'>
          {this.renderIcon(item)}
          <div styleName='values'>
            <div styleName='title'>{item.title()}</div>
            {item.details().map((item, index) => {
              const value = item.value instanceof Amount
                ? <TokenValue value={item.value} />
                : item.value
              return (
                <div key={index}>
                  <span><Translate value={item.label} />:&nbsp;</span>
                  <span>{value}</span>
                </div>
              )
            })}
          </div>
          {wallet.is2FA
            ? (
              <div styleName='actions'>
                {item.isPending
                  ? <Preloader />
                  : (
                    <Button
                      label={<Translate value='wallet.enterCode' />}
                      onClick={this.handleEnterCode(wallet, item)}
                    />
                  )}
              </div>
            ) : (
              <div styleName='actions'>
                <Button
                  flat
                  label={<Translate value='wallet.revoke' />}
                  disabled={!isConfirmed}
                  onClick={this.handleRevoke(wallet, item)}
                />
                <Button
                  label={<Translate value='wallet.sign' />}
                  disabled={isConfirmed}
                  onClick={this.handleConfirm(wallet, item)}
                />
              </div>
            )}
        </div>
      </div>
    )
  }

  render () {
    const { wallet } = this.props

    if (wallet && !wallet.isMultisig) return null

    return (
      <div styleName='root' className='PendingTxWidget__root'>
        <div styleName='header'>
          <Translate value={`${prefix}.title`} />
        </div>
        <div styleName='body'>
          {wallet
            ? wallet.pendingCount > 0
              ? Object.values(wallet.pendingTxList).map(this.renderRow(wallet))
              : <Translate value={`${prefix}.noTransfers`} />
            : <Preloader />
          }
        </div>
      </div>
    )
  }
}

