import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Paper } from 'material-ui'
import { SendTokens, DepositTokens, TransactionsTable, Points } from 'components'

import { getAccountTransactions } from 'redux/wallet/actions'

import styles from 'layouts/partials/styles'

import './WalletContent.scss'

export class WalletContent extends Component {

  static propTypes = {
    getTransactions: PropTypes.func,
    tokens: PropTypes.object,
    ready: PropTypes.bool,
    isFetching: PropTypes.bool,
    transactions: PropTypes.object,
    endOfList: PropTypes.bool
  }

  constructor(props) {
    super(props)
  }

  render() {
    return !this.props.ready ? null : (
      <div styleName="root">
        <div styleName="content">
          <div>
          <div className="WalletContent__grid">
            <div className="row">
              <div className="col-sm-4 col-md-3 col-lg-3 col-xl-2" styleName="head-light">
                <Paper style={styles.content.paper.style}>
                  <SendTokens title="Send tokens" />
                </Paper>
              </div>
              <div className="col-sm-6 col-md-3 col-lg-3 col-xl-4">
                <div styleName="instructions">
                  <h3>How to make a transfer?</h3>
                  <div styleName="description">
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
                      Check values and press “SEND”.
                    </span>
                  </Points>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4 col-md-3 col-lg-3 col-xl-2" styleName="head-dark">
                <Paper style={styles.content.paper.style}>
                  <DepositTokens title="Deposit TIME" />
                </Paper>
              </div>
              <div className="col-sm-6 col-md-3 col-lg-3 col-xl-4">
                <div styleName="instructions">
                  <h3>How to make TIME token deposit?</h3>
                  <div styleName="description">
                    <p>
                      To use stakeholders features such as Rewards and Voting, you should deposit TIME tokens.
                    </p>
                    <Points>
                      <span>
                        Enter the amount you would like to deposit. You can require TIME once for testing purposes.
                      </span>
                        <span>
                        Check value and press “LOCK”.
                      </span>
                        <span>
                        To withdraw your TIME tokens repeat step 1, check value and press "WITHDRAW".
                      </span>
                    </Points>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Paper style={styles.content.paper.style}>
                  <TransactionsTable
                    tokens={this.props.tokens}
                    transactions={this.props.transactions}
                    isFetching={this.props.isFetching}
                    endOfList={this.props.endOfList}
                    onLoadMore={() => this.props.getTransactions(this.props.tokens)}
                  />
                </Paper>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const wallet = state.get('wallet')
  return {
    ready: !wallet.tokensFetching,
    tokens: wallet.tokens,
    transactions: wallet.transactions.list,
    isFetching: wallet.transactions.isFetching,
    endOfList: wallet.transactions.endOfList,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getTransactions: (tokens) => {
      dispatch(getAccountTransactions(tokens))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletContent)
