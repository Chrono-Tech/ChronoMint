import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Paper, CircularProgress } from 'material-ui'
import { SendTokens, DepositTokens, TransactionsTable, Points, WalletChanger, WalletPendingTransfers } from 'components'

import * as actions from 'redux/wallet/actions'
window.actions = actions
import { isTestingNetwork } from 'network/settings'

import styles from 'layouts/partials/styles'

import './WalletContent.scss'

export class WalletContent extends Component {

  static propTypes = {
    getTransactions: PropTypes.func,
    tokens: PropTypes.object,
    ready: PropTypes.bool,
    isFetching: PropTypes.bool,
    isMultisig: PropTypes.bool,
    transactions: PropTypes.object,
    endOfList: PropTypes.bool,
    isTesting: PropTypes.bool,
    selectedNetworkId: PropTypes.number,
    selectedProviderId: PropTypes.number
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  renderWalletsInstructions () {
    return (
      <div className='col-xs-6 col-sm-4 col-md-3 col-lg-3 col-xl-4'>
        <div styleName='instructions'>
          <h3>You can use the multisignature wallets</h3>
          <div styleName='description'>
            <p>
              Wallets are smart contracts which manage assets and can be owned by multiple accounts.
              Unlike accounts, contract wallets are controlled by code, which means that it is
              possible to customize their behavior. The most common use-case are multi-signature wallets,
              that allow for transaction logging, withdrawal limits, and rule-sets for signatures required.
            </p>
          </div>
        </div>
      </div>
    )
  }

  renderPendingTransfers () {
    return (
      <div className='col-xs-6 col-sm-4 col-md-3 col-lg-3 col-xl-2' styleName='head-light'>
        <Paper style={styles.content.paper.style}>
          <WalletPendingTransfers walletName='Some wallet' />
        </Paper>
      </div>
    )
  }

  renderTime () {
    return (
      <div className='row'>
        <div className='col-sm-4 col-md-3 col-lg-3 col-xl-2' styleName='head-dark' id='deposit-tokens'>
          <Paper style={styles.content.paper.style}>
            <DepositTokens title='Deposit TIME' />
          </Paper>
        </div>
        <div className='col-sm-4 col-md-3 col-lg-3 col-xl-4'>
          <div styleName='instructions'>
            <h3>How to make TIME token deposit?</h3>
            <div styleName='description'>
              {!this.props.isTesting ?
                <p><b>Deposit TIME is temporarily limited to 1 TIME on the main network.</b><br /><br /></p> : ''}
              <p>To use stakeholders features such as Rewards and Voting, you should deposit TIME tokens.</p>
            </div>
            <Points>
              <span>
              Enter the amount you wold like to deposit. You can require TIME once for testing purposes.
              </span>
              <span>
              Check value and press APPROVE to allow TIME holder contract to deposit your tokens.
              This is for your safety.
              </span>
              <span>
              Wait until allowance will be updated and press LOCK.
              To withdraw enter the amount and press WITHDRAW.
              </span>
            </Points>
          </div>
        </div>
      </div>
    )
  }

  renderTransactionInstructions () {
    return (
      <div className='col-xs-6 col-sm-4 col-md-3 col-lg-3 col-xl-4'>
        <div styleName='instructions'>
          <h3>How to make a transfer?</h3>
          <div styleName='description'>
            <p>
              If you plan to move a large amount of ether, you should test sending a small amount to your wallet
              first to ensure everything goes as planned.
            </p>
          </div>
          <Points>
            <span>
            Enter the address you would like to send to in the “Recipient address” field.
            </span>
            <span>
            Enter the amount you would like to send.
            </span>
            <span>
            Check values and press SEND.<br />
            If you want to allow a contract to send your tokens (not ETH) – repeat same but press APPROVE.
            </span>
          </Points>
        </div>
      </div>
    )
  }

  renderWalletChanger () {
    return (
      <div className='col-xs-6 col-sm-4 col-md-3 col-lg-3 col-xl-2' styleName='head-light'>
        <Paper style={styles.content.paper.style}>
          <WalletChanger walletName='Some wallet' />
        </Paper>
      </div>
    )
  }

  renderSendTokens () {
    return (
      <div className='col-xs-6 col-sm-4 col-md-3 col-lg-3 col-xl-2' styleName='head-light'>
        <Paper style={styles.content.paper.style}>
          <SendTokens title='Send tokens' />
        </Paper>
      </div>
    )
  }

  renderTransactions () {
    return (
      <div className='row'>
        <div className='col-md-6'>
          <Paper style={styles.content.paper.style}>
            <TransactionsTable
              tokens={this.props.tokens}
              transactions={this.props.transactions}
              isFetching={this.props.isFetching}
              endOfList={this.props.endOfList}
              selectedNetworkId={this.props.selectedNetworkId}
              selectedProviderId={this.props.selectedProviderId}
              onLoadMore={() => this.props.getTransactions(this.props.tokens)}
            />
          </Paper>
        </div>
      </div>
    )
  }

  renderMultisig () {
    return (
      <div className='WalletContent__grid'>
        <div className='row'>
          <div className='col-xs-6 col-sm-4 col-md-3 col-lg-3 col-xl-2'>
            {this.renderWalletChanger()}
            <div className='col-xs-6 col-sm-4 col-md-3 col-lg-3 col-xl-2' styleName='spacer'>
            </div>
            {this.renderSendTokens()}
          </div>
          {this.renderPendingTransfers()}
        </div>
        {this.renderTransactions()}
      </div>
    )
  }

  renderMain () {
    return (
      <div className='WalletContent__grid'>
        <div className='row'>
          {this.renderWalletChanger()}
          {this.renderWalletsInstructions()}
        </div>
        <div className='row'>
          {this.renderSendTokens()}
          {this.renderTransactionInstructions()}
        </div>
        {this.renderTime()}
        {this.renderTransactions()}
      </div>
    )
  }

  render () {
    return !this.props.ready ? (<div styleName='progress'><CircularProgress size={24} thickness={1.5} /></div>) : (
      <div styleName='root'>
        <div styleName='content'>
          <div>
            {this.props.isMultisig ? this.renderMultisig() : this.renderMain()}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  window.state = state
  const wallet = state.get('wallet')
  return {
    ready: !wallet.tokensFetching,
    tokens: wallet.tokens,
    transactions: wallet.transactions.list,
    isFetching: wallet.transactions.isFetching,
    endOfList: wallet.transactions.endOfList,
    selectedNetworkId: state.get('network').selectedNetworkId,
    selectedProviderId: state.get('network').selectedProviderId,
    isTesting: isTestingNetwork(state.get('network').selectedNetworkId, state.get('network').selectedProviderId),
    isMultisig: wallet.isMultisig
  }
}

function mapDispatchToProps (dispatch) {
  window.dispatch = dispatch
  return {
    getTransactions: (tokens) => {
      dispatch(actions.getAccountTransactions(tokens))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletContent)
