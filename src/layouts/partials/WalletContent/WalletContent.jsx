import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { Paper } from 'material-ui'
import { SendTokens, DepositTokens, TransactionsTable, Points, WalletChanger, WalletPendingTransfers } from 'components'
import Preloader from 'components/common/Preloader/Preloader'
import * as actions from 'redux/wallet/actions'
import { isTestingNetwork } from 'network/settings'
import styles from 'layouts/partials/styles'
import './WalletContent.scss'

function prefix(token) {
  return `layouts.partials.WalletContent.${token}`
}

export class WalletContent extends Component {
  static propTypes = {
    getTransactions: PropTypes.func,
    tokens: PropTypes.object,
    tokensFetched: PropTypes.bool,
    isFetching: PropTypes.bool,
    isMultisig: PropTypes.bool,
    transactions: PropTypes.object,
    endOfList: PropTypes.bool,
    isTesting: PropTypes.bool,
    selectedNetworkId: PropTypes.number,
    selectedProviderId: PropTypes.number,
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  renderWalletsInstructions() {
    return (
      <div className='col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-4'>
        <div styleName='instructions'>
          <h3><Translate value='layouts.partials.WalletContent.youCanUseTheMultisignatureWallets' /></h3>
          <div styleName='instructionsDescription'>
            <p>
              <Translate value='layouts.partials.WalletContent.walletsAreSmartContractsWhichManageAssets' />
            </p>
          </div>
        </div>
      </div>
    )
  }

  renderPendingTransfers() {
    return (
      <div className='col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-2' styleName='headLight'>
        <Paper style={styles.content.paper.style}>
          <WalletPendingTransfers walletName='Chronobank multisig wallet (demo)' />
        </Paper>
      </div>
    )
  }

  renderTime() {
    return (
      <div className='row'>
        <div className='col-sm-6 col-md-3 col-lg-3 col-xl-2' styleName='headDark' id='deposit-tokens'>
          {this.props.tokensFetched
            ? (
              <Paper style={styles.content.paper.style}>
                <DepositTokens title={<Translate value={prefix('depositTime')} />} />
              </Paper>
            )
            : <Preloader />
          }
        </div>
        <div className='col-sm-6 col-md-3 col-lg-3 col-xl-4'>
          <div styleName='instructions'>
            <h3><Translate {...{ value: prefix('howToMakeTime') }} /></h3>
            <div styleName='instructionsDescription'>
              {!this.props.isTesting ?
                <p><b><Translate value={prefix('depositTimeIsTemporarilyLimited')} /></b><br /><br /></p> : ''}
              <p><Translate value={prefix('toUseStakeholders')} /></p>
            </div>
            <Points>
              <span>
                <Translate value={prefix('enterTheAmount')} />
              </span>
              <span>
                <Translate value={prefix('checkValueAndPress')} />
              </span>
              <span>
                <Translate value={prefix('waitUntilAllowance')} />
              </span>
            </Points>
          </div>
        </div>
      </div>
    )
  }

  renderTransactionInstructions() {
    return (
      <div className='col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-4'>
        <div styleName='instructions'>
          <h3><Translate value={prefix('howToMakeATransfer')} /></h3>
          <div styleName='instructionsDescription'>
            <p>
              <Translate value={prefix('ifYouPlanToMoveALargeAmountOfEther')} />
            </p>
          </div>
          <Points>
            <span>
              <Translate value={prefix('enterTheAddressYouWouldLikeToSendTo')} />
            </span>
            <span>
              <Translate value={prefix('enterTheAmountYouWouldLikeToSend')} />
            </span>
            <span>
              <Translate value={prefix('checkValuesAndPressSend')} /><br />
              <Translate value={prefix('ifYouWantToAllowAContract')} />
            </span>
          </Points>
        </div>
      </div>
    )
  }

  renderWalletChanger() {
    return (
      <div className='col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-2' styleName='headLight'>
        <Paper style={styles.content.paper.style}>
          <WalletChanger walletName='Chronobank single wallet (demo)' />
        </Paper>
      </div>
    )
  }

  renderSendTokens() {
    return (
      <div className='col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-2' styleName='headLight'>
        {this.props.tokensFetched
          ? (
            <Paper style={styles.content.paper.style}>
              <SendTokens title={<Translate value={prefix('sendTokens')} />} />
            </Paper>
          )
          : <Preloader />
        }
      </div>
    )
  }

  renderTransactions() {
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

  renderMultisig() {
    return (
      <div className='WalletContent__grid'>
        <div className='row'>
          <div className='col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-2'>
            {this.renderWalletChanger()}
            <div className='col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-2' styleName='spacer' />
            {this.renderSendTokens()}
          </div>
          {this.renderPendingTransfers()}
        </div>
        {this.renderTransactions()}
      </div>
    )
  }

  renderMain() {
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

  render() {
    return (
      <div styleName='root'>
        <div styleName='content'>
          {this.props.isMultisig ? this.renderMultisig() : this.renderMain()}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const wallet = state.get('wallet')
  const network = state.get('network')
  return {
    tokensFetched: wallet.tokensFetched,
    tokens: wallet.tokens,
    transactions: wallet.transactions.list,
    isFetching: wallet.transactions.isFetching,
    endOfList: wallet.transactions.endOfList,
    selectedNetworkId: network.selectedNetworkId,
    selectedProviderId: network.selectedProviderId,
    isTesting: isTestingNetwork(network.selectedNetworkId, network.selectedProviderId),
    isMultisig: wallet.isMultisig,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getTransactions: tokens => {
      dispatch(actions.getAccountTransactions(tokens))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletContent)
