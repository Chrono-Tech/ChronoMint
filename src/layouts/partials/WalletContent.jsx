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
                  <h3>Title send tokens lorem</h3>
                  <div styleName="description">
                    <p>
                      Once the printer ink runs dry it has to be replaced
                      with another inkjet cartridge. There are many reputed
                      companies like Canon, Epson, Dell, and Lexmark that
                      provide the necessary cartridges to replace the empty
                      cartridges.
                    </p>
                  </div>
                  <Points>
                    <span>
                      You should lorem ipsum very much
                      You should lorem ipsum very much
                    </span>
                    <span>
                      You should lorem ipsum very much
                      You should lorem ipsum very much
                    </span>
                    <span>
                      You should lorem ipsum very much
                      You should lorem ipsum very much
                    </span>
                  </Points>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4 col-md-3 col-lg-3 col-xl-2" styleName="head-dark">
                <Paper style={styles.content.paper.style}>
                  <DepositTokens title="Deposit tokens" />
                </Paper>
              </div>
              <div className="col-sm-6 col-md-3 col-lg-3 col-xl-4">
                <div styleName="instructions">
                  <h3>Title send tokens lorem</h3>
                  <div styleName="description">
                    <p>
                      Once the printer ink runs dry it has to be replaced with
                      another inkjet cartridge. There are many reputed
                      companies like Canon, Epson, Dell, and Lexmark that
                      provide the necessary cartridges to replace the empty
                      cartridges.
                    </p>
                    <p>
                      Replacing inkjet cartridge can add to a very big cost.
                      It could be worse if you have to replace the empty
                      cartridges frequently every month. Nowadays many buyers
                      are making use of compatible Inkjet Cartridges as they
                      are less expensive and are easily available online.
                    </p>
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
