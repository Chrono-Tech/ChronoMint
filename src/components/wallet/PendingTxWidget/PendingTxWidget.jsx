/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import { Button, TokenValue } from 'components'
import React, { PureComponent } from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/actions'
import TokensCollection from '@chronobank/core/models/tokens/TokensCollection'
import MultisigWalletModel from '@chronobank/core/models/wallet/MultisigWalletModel'
import Preloader from 'components/common/Preloader/Preloader'
import MultisigWalletPendingTxModel from '@chronobank/core/models/wallet/MultisigWalletPendingTxModel'
import Amount from '@chronobank/core/models/Amount'
import { confirmMultisigTx, getPendingData, revokeMultisigTx } from '@chronobank/core/redux/multisigWallet/actions'
import { DUCK_I18N } from 'redux/i18n/actions'
import { modalsOpen } from 'redux/modals/actions'
import TwoFaConfirmModal from 'components/wallet/TwoFaConfirmModal/TwoFaConfirmModal'
import DerivedWalletModel from '@chronobank/core/models/wallet/DerivedWalletModel'
import { getMultisigWallets } from '@chronobank/core/redux/wallet/selectors/models'
import { PTWallet } from '@chronobank/core/redux/wallet/types'

import { prefix } from './lang'
import './PendingTxWidget.scss'

function mapStateToProps (state, ownProps) {
  return {
    wallet: !ownProps.walletInfo.isMain ? getMultisigWallets(state).item(ownProps.walletInfo.address) : null,
    tokens: state.get(DUCK_TOKENS),
    locale: state.get(DUCK_I18N).locale,
  }
}

function mapDispatchToProps (dispatch) {

  return {
    revoke: (wallet, tx) => dispatch(revokeMultisigTx(wallet, tx)),
    confirm: (wallet, tx) => dispatch(confirmMultisigTx(wallet, tx)),
    enterCode: (wallet, tx) => dispatch(modalsOpen({
      component: TwoFaConfirmModal,
      props: {
        wallet,
        tx,
      },
    })),
    getPendingData: (wallet, pending) => dispatch(getPendingData(wallet, pending)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PendingTxWidget extends PureComponent {
  static propTypes = {
    wallet: PropTypes.oneOfType([
      PropTypes.instanceOf(MultisigWalletModel),
      PropTypes.instanceOf(DerivedWalletModel),
    ]),
    revoke: PropTypes.func,
    confirm: PropTypes.func,
    getPendingData: PropTypes.func,
    tokens: PropTypes.instanceOf(TokensCollection),
    locale: PropTypes.string,
    enterCode: PropTypes.func,
    walletInfo: PTWallet,
  }

  componentDidMount () {
    this.checkAndFetchPendings(this.props.wallet)
  }

  componentWillReceiveProps ({ wallet }) {
    this.checkAndFetchPendings(wallet)
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

  checkAndFetchPendings (wallet) {
    if (!wallet || (!wallet.is2FA() && !wallet.isMultisig()) || wallet.pendingTxList().isFetched() || wallet.pendingTxList().isFetching()) {
      return
    }

    wallet.pendingTxList().items().forEach((item) => {
      if (item.isFetched() || item.isFetching()) {
        return
      }
      this.props.getPendingData(wallet, item)
    })
  }

  renderIcon (tx: MultisigWalletPendingTxModel) {
    const func = tx.decodedTx().funcName()
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

  renderRow (wallet, item: MultisigWalletPendingTxModel) {
    const isConfirmed = item.isConfirmed()

    return (
      <div styleName='row' key={item.id()}>
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
                  <span>{item.label}:&nbsp;</span>
                  <span>{value}</span>
                </div>
              )
            })}
          </div>
          {wallet.is2FA()
            ? (
              <div styleName='actions'>
                {item.isPending()
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
                  onClick={isConfirmed
                    ? this.handleRevoke(wallet, item)
                    : undefined
                  }
                />
                <Button
                  label={<Translate value='wallet.sign' />}
                  disabled={isConfirmed}
                  onClick={!isConfirmed
                    ? this.handleConfirm(wallet, item)
                    : undefined
                  }
                />
              </div>
            )}
        </div>
      </div>
    )
  }

  render () {
    const { wallet, walletInfo } = this.props

    if (!walletInfo || !walletInfo.isMultisig || !walletInfo.is2FA) {
      return null
    }

    return (
      <div styleName='root' className='PendingTxWidget__root'>
        <div styleName='header'>
          <Translate value={`${prefix}.title`} />
        </div>
        <div styleName='body'>
          {!wallet
            ? <Preloader />
            : wallet.pendingTxList().size() > 0
              ? wallet.pendingTxList().items().map((item) => this.renderRow(wallet, item))
              : <Translate value={`${prefix}.noTransfers`} />
          }
        </div>
      </div>
    )
  }
}

