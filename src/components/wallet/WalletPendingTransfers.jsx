import { Paper, RaisedButton } from 'material-ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'

import type MultisigWalletPendingTxModel from 'models/Wallet/MultisigWalletPendingTxModel'

import { confirmMultisigTx, DUCK_MULTISIG_WALLET, revokeMultisigTx } from 'redux/multisigWallet/actions'

import Preloader from 'components/common/Preloader/Preloader'
import TokenValue from 'components/common/TokenValue/TokenValue'

import './WalletPendingTransfers.scss'

function mapStateToProps (state) {
  return {
    wallet: state.get(DUCK_MULTISIG_WALLET).selected(),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    revoke: (wallet, tx) => dispatch(revokeMultisigTx(wallet, tx)),
    confirm: (wallet, tx) => dispatch(confirmMultisigTx(wallet, tx)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletPendingTransfers extends React.Component {
  static propTypes = {
    wallet: PropTypes.object,
    revoke: PropTypes.func,
    confirm: PropTypes.func,
  }

  renderRow (wallet, item: MultisigWalletPendingTxModel) {
    return (
      <div styleName='transfer' key={item.id()}>
        <div styleName='left'>
          <div styleName='toAccount'>
            <div styleName='account'>{item.to()}</div>
          </div>
          <div styleName='issue'>
            <TokenValue
              noRenderPrice
              value={item.value()}
              symbol={item.symbol()}
            />
          </div>
        </div>
        <div styleName='right'>
          <div styleName='revoke'>
            <RaisedButton
              label={<Translate value='wallet.revoke' />}
              disabled={!item.isConfirmed()}
              onTouchTap={() => this.props.revoke(wallet, item)}
            />
          </div>
          <div styleName='sign'>
            <RaisedButton
              label={<Translate value='wallet.sign' />}
              disabled={item.isConfirmed()}
              onTouchTap={() => this.props.confirm(wallet, item)}
              primary
            />
          </div>
        </div>
      </div>
    )
  }

  renderTable () {
    const { wallet } = this.props
    return (
      <div>
        <div styleName='tableHead'>
          <div styleName='left'>
            <div styleName='toAccount tableHeadElem'><Translate value='wallet.to' /></div>
            <div styleName='issue'>
              <div styleName='value tableHeadElem'><Translate value='wallet.value' /></div>
              <div styleName='currency'>token</div>
            </div>
          </div>
          <div styleName='right'>
            <div styleName='revoke' />
            <div styleName='sign' />
          </div>
        </div>
        {wallet.pendingTxList().items().map((item) => this.renderRow(wallet, item))}
      </div>
    )
  }

  render () {
    return (
      <Paper>
        <div styleName='header'>
          <div styleName='title'><Translate value='wallet.pendingTransfers' /></div>
        </div>
        <div styleName='body'>
          {!this.props.wallet
            ? <Preloader />
            : this.props.wallet.pendingTxList().size() > 0
              ? this.renderTable()
              : 'No transfers'
          }
        </div>
      </Paper>
    )
  }
}
