import React from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Paper, RaisedButton } from 'material-ui'
import type MultisigWalletModel from 'models/Wallet/MultisigWalletModel'
import type MultisigWalletPendingTxModel from 'models/Wallet/MultisigWalletPendingTxModel'
import TokenValue from 'components/common/TokenValue/TokenValue'
import { DUCK_MULTISIG_WALLET } from 'redux/multisigWallet/actions'
import './WalletPendingTransfers.scss'

function mapStateToProps (state) {
  let pendingTxList
  const wallet: MultisigWalletModel = state.get(DUCK_MULTISIG_WALLET).selected()

  if (wallet) {
    pendingTxList = wallet.pendingTxList()
  }
  return {
    pendingTxList,
  }
}

@connect(mapStateToProps, null)
export default class WalletPendingTransfers extends React.Component {
  static propTypes = {
    pendingTxList: PropTypes.object,
  }

  renderRow (item: MultisigWalletPendingTxModel) {
    return (
      <div styleName='transfer' key={item.id()}>
        <div styleName='left'>
          <div styleName='toAccount'>
            <div styleName='account'>{item.to()}</div>
          </div>
          <div styleName='issue'>
            <TokenValue
              value={item.value()}
              symbol={item.symbol()}
            />
          </div>
        </div>
        <div styleName='right'>
          <div styleName='revoke'>
            <RaisedButton
              label={<Translate value='wallet.revoke' />}
            />
          </div>
          <div styleName='sign'>
            <RaisedButton
              label={<Translate value='wallet.sign' />}
              primary
              disabled={false}
            />
          </div>
        </div>
      </div>
    )
  }

  renderTable () {
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
            <div styleName='revoke'>
              <RaisedButton label={<Translate value='wallet.revoke' />} />
            </div>
            <div styleName='sign'>
              <RaisedButton label={<Translate value='wallet.sign' />} />
            </div>
          </div>
        </div>
        {this.props.pendingTxList.map(item => this.renderRow(item))}
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
          {this.props.pendingTxList.size > 0
            ? this.renderTable()
            : 'No transfers'
          }
        </div>
      </Paper>
    )
  }
}
