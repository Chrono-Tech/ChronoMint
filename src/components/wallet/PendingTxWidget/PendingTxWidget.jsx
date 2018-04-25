/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import TokensCollection from 'models/tokens/TokensCollection'
import { Button } from 'components'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import Preloader from 'components/common/Preloader/Preloader'
import MultisigWalletPendingTxModel from 'models/wallet/MultisigWalletPendingTxModel'
import Amount from 'models/Amount'
import { confirmMultisigTx, getPendingData, revokeMultisigTx } from 'redux/multisigWallet/actions'
import { DUCK_I18N } from 'redux/configureStore'

import { prefix } from './lang'
import './PendingTxWidget.scss'

function mapStateToProps (state) {
  return {
    tokens: state.get(DUCK_TOKENS),
    locale: state.get(DUCK_I18N).locale,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    revoke: (wallet, tx) => dispatch(revokeMultisigTx(wallet, tx)),
    confirm: (wallet, tx) => dispatch(confirmMultisigTx(wallet, tx)),
    getPendingData: (wallet, pending) => dispatch(getPendingData(wallet, pending)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PendingTxWidget extends PureComponent {
  static propTypes = {
    wallet: PropTypes.instanceOf(MultisigWalletModel),
    revoke: PropTypes.func,
    confirm: PropTypes.func,
    getPendingData: PropTypes.func,
    tokens: PropTypes.instanceOf(TokensCollection),
    locale: PropTypes.string,
  }

  componentWillMount () {
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

  checkAndFetchPendings (wallet) {
    if (wallet.pendingTxList().isFetched() || wallet.pendingTxList().isFetching()) {
      return
    }

    wallet.pendingTxList().items().forEach((item) => {
      if (item.isFetched() || item.isFetching()) {
        return
      }
      this.props.getPendingData(wallet, item)
    })
  }

  renderRow (wallet, item: MultisigWalletPendingTxModel) {
    const isConfirmed = item.isConfirmed()

    return (
      <div key={item.id()}>
        {item.isPending()
          ? <Preloader />
          : (
            <div>
              <div>{item.title()}</div>
              {item.details().map((item, index) => {
                const value = item.value instanceof Amount
                  ? +this.props.tokens.getBySymbol(item.value.symbol()).removeDecimals(item.value)
                  : item.value
                return (
                  <div key={index}>
                    <span>{item.label}:</span>
                    <span>{value}</span>
                  </div>
                )
              })}
            </div>
          )
        }
        <div>
          <div>
            <Button
              label={<Translate value='wallet.revoke' />}
              disabled={!isConfirmed}
              onTouchTap={isConfirmed
                ? this.handleRevoke(wallet, item)
                : undefined
              }
            />
          </div>
          <Button
            label={<Translate value='wallet.sign' />}
            disabled={isConfirmed}
            onTouchTap={!isConfirmed
              ? this.handleConfirm(wallet, item)
              : undefined
            }
          />
        </div>
      </div>
    )
  }

  renderTable () {
    const { wallet } = this.props
    return (
      <div>
        {wallet.pendingTxList().items().map((item) => this.renderRow(wallet, item))}
      </div>
    )
  }

  render () {
    // TODO @abdulov make a widget
    // const transactions = buildTableData(this.props.wallet.pendingTxList(), this.props.locale)

    return (
      <div styleName='root' className='PendingTxWidget__root'>
        <div styleName='header'>
          <Translate value={`${prefix}.title`} />
        </div>
        <div styleName='body'>
          {!this.props.wallet
            ? <Preloader />
            : this.props.wallet.pendingTxList().size() > 0
              ? this.renderTable()
              : 'No transfers'
          }
        </div>
      </div>
    )
  }
}

