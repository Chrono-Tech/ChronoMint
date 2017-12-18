import Preloader from 'components/common/Preloader/Preloader'
import { Paper, RaisedButton } from 'material-ui'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import type MultisigWalletPendingTxModel from 'models/wallet/MultisigWalletPendingTxModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { confirmMultisigTx, DUCK_MULTISIG_WALLET, getPendingData, revokeMultisigTx } from 'redux/multisigWallet/actions'
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
    getPendingData: (wallet, pending) => dispatch(getPendingData(wallet, pending)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletPendingTransfers extends PureComponent {
  static propTypes = {
    wallet: PropTypes.instanceOf(MultisigWalletModel),
    revoke: PropTypes.func,
    confirm: PropTypes.func,
    getPendingData: PropTypes.func,
  }

  componentWillMount () {
    const { wallet } = this.props
    wallet.pendingTxList().list().forEach((item) => {
      if (!item.isFetched() && !item.isFetching()) {
        this.props.getPendingData(wallet, item)
      }
    })
  }

  componentWillReceiveProps ({ wallet }) {
    wallet.pendingTxList().list().forEach((item) => {
      if (!item.isFetched() && !item.isFetching()) {
        this.props.getPendingData(wallet, item)
      }
    })
  }

  renderRow (wallet, item: MultisigWalletPendingTxModel) {
    return (
      <div styleName='transfer' key={item.id()}>
        <div styleName='left'>
          <div styleName='toAccount'>
            <div styleName='account'>item.to()</div>
          </div>
          <div styleName='issue'>
            decription: TODO
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
