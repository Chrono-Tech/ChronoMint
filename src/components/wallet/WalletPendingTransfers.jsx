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
    this.checkAndFetchPendings(this.props.wallet)
  }

  componentWillReceiveProps ({ wallet }) {
    this.checkAndFetchPendings(wallet)
  }

  checkAndFetchPendings (wallet) {
    if (wallet.pendingTxList().isFetched()) {
      return
    }

    wallet.pendingTxList().items().forEach((item) => {
      if (!item.isFetched() && !item.isFetching()) {
        this.props.getPendingData(wallet, item)
      }
    })
  }

  renderRow (wallet, item: MultisigWalletPendingTxModel) {
    return (
      <div styleName='row' key={item.id()}>
        <div styleName='left'>
          <div styleName='itemTitle'>{item.title()}</div>
          {item.isFetched()
            ? <Preloader />
            : item.details().map((item, index) => (
              <div key={index} styleName='detail'>
                <span styleName='detailKey'>{item.label}:</span>
                <span styleName='detailValue'>{item.value}</span>
              </div>
            ))}
        </div>
        <div styleName='right'>
          <div styleName='action'>
            <RaisedButton
              label={<Translate value='wallet.revoke' />}
              disabled={!item.isConfirmed()}
              onTouchTap={() => this.props.revoke(wallet, item)}
            />
          </div>
          <RaisedButton
            label={<Translate value='wallet.sign' />}
            disabled={item.isConfirmed()}
            onTouchTap={() => this.props.confirm(wallet, item)}
            primary
          />
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
            <div styleName='tableHeadElem'><Translate value='wallet.transaction' /></div>
          </div>
          <div styleName='right'>
            <div styleName='tableHeadElem'><Translate value='wallet.actions' /></div>
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
