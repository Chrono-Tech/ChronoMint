import BigNumber from 'bignumber.js'
// import { CSSTransitionGroup } from 'react-transition-group'
import PropTypes from 'prop-types'
import { RaisedButton, TextField } from 'material-ui'
// TODO @bshevchenko: this is intermediate version for demo
import React from 'react'
import { connect } from 'react-redux'

import type ExchangeOrderModel from 'models/ExchangeOrderModel'

import { exchange } from 'redux/exchange/actions'
import { modalsClose } from 'redux/modals/actions'

// import RateHistoryChart from '../exchange/RateHistoryChart'
import TokenValue from 'components/common/TokenValue/TokenValue'

import ModalDialog from './ModalDialog'

import './BuyTokensDialog.scss'

export class BuyTokensDialog extends React.Component {
  static propTypes = {
    order: PropTypes.object,
    handleClose: PropTypes.func,
    exchange: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      main: new BigNumber(0),
      second: new BigNumber(0),
      isPossible: false,
    }
  }

  order(): ExchangeOrderModel {
    return this.props.order
  }

  handleChangeMain(v) {
    let main
    let second

    try {
      main = new BigNumber(v)
    } catch (e) {
      main = new BigNumber(0)
    }

    if (this.order().isBuyMain()) {
      second = this.order().sellPrice().mul(main)
    }

    if (this.order().isSellMain()) {
      second = this.order().buyPrice().mul(main)
    }

    this.setState({
      main,
      second,
    })

    this.updateIsPossible()
  }

  handleChangeSecond(v) {
    let main
    let second

    try {
      second = new BigNumber(v)
    } catch (e) {
      second = new BigNumber(0)
    }

    if (this.order().isBuyMain()) {
      main = second.div(this.order().sellPrice())
    }

    if (this.order().isSellMain()) {
      main = second.div(this.order().buyPrice())
    }

    this.setState({
      main,
      second,
    })

    this.updateIsPossible()
  }

  updateIsPossible() {
    let isPossible = false
    const { main, second } = this.state

    if (this.order().isBuyMain()) {
      if (main.lte(this.order().limit()) && second.lte(this.order().accountBalance())) {
        isPossible = true
      }
    }

    if (this.order().isSellMain()) {
      if (second.lte(this.order().limit()) && main.lte(this.order().accountBalance())) {
        isPossible = true
      }
    }

    this.setState({
      isPossible,
    })
  }

  handleExchange() {
    this.props.exchange(
      this.props.order,
      this.state.main
    )
  }

  render() {
    const icons = {
      lht: require('assets/img/icn-lht.svg'),
      ethereum: require('assets/img/icn-ethereum.svg'),
    }

    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >
        <ModalDialog onClose={() => this.props.handleClose()}>
          <div styleName='root'>
            <div styleName='header'>
              <div styleName='row'>
                <div styleName='col1'>
                  <h3>{this.order().isBuy() ? 'Buy' : 'Sell'} {this.order().symbol()} Tokens</h3>
                  {/* <div styleName='balance'>
                    <div styleName='label'>Balance:</div>
                    <TokenValue
                      value={order.limit()}
                      symbol={order.symbol()}
                    />
                  </div> */}
                </div>
                <div styleName='col2'>
                  <div className='ByTokensDialog__icons'>
                    <div className='row'>
                      <div className='col-xs-1'>
                        <div className='icon'>
                          <div
                            className='content'
                            style={{
                              background: `#05326a url(${icons.lht}) no-repeat center center`,
                            }}
                          >
                            {/* <div className='title'>LHT</div> */}
                          </div>
                        </div>
                      </div>
                      <div className='col-xs-1'>
                        <div className='icon'>
                          <div
                            className='content'
                            style={{
                              background: `#5c6bc0 url(${icons.ethereum}) no-repeat center center`,
                            }}
                          >
                            {/* <div className='title'>ETH</div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div styleName='content'>
              <div styleName='row'>
                <div styleName='col1'>
                  <div>
                    <div styleName='property'>
                      <div styleName='label'>Account:</div>
                      <div>
                        <span styleName='value'>
                          <span className='fa fa-user' />&nbsp;
                          <span styleName='value1'>ChronoBank</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div styleName='property'>
                      <div styleName='label'>Trade limits:</div>
                      <div>
                        <TokenValue
                          value={this.order().limit()}
                          symbol={this.order().symbol()}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div styleName='property'>
                      <div styleName='label'>Balance:</div>
                      <div>
                        <TokenValue
                          value={this.order().accountBalance()}
                          symbol={this.order().accountBalanceSymbol()}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div styleName='col2'>
                  <div className='ByTokensDialog__form'>
                    <div className='row'>
                      <div className='col-xs-2'>
                        <TextField
                          floatingLabelText='LHT:'
                          value={this.state.main.toString(10)}
                          style={{ width: 150 }}
                          onChange={(e, value) => this.handleChangeMain(value)}
                        />
                      </div>
                      <div className='col-xs-2'>
                        <TextField
                          floatingLabelText='ETH:'
                          value={this.state.second.toString(10)}
                          style={{ width: 150 }}
                          onChange={(e, value) => this.handleChangeSecond(value)}
                        />
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-xs-2'>
                        <div styleName='actions'>
                          <RaisedButton
                            label={`${this.order().isBuy() ? 'Buy' : 'Sell'} ${this.order().symbol()}`}
                            disabled={!this.state.isPossible || this.state.main <= 0}
                            primary
                            onTouchTap={() => this.handleExchange()}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div styleName='footer'>
              <div styleName='row'>
                <div styleName='col1'>
                  <h3>Rates</h3>
                  {this.renderRates()}
                </div>
                <div styleName='col2'>
                  <div styleName='chart'>
                    <div styleName='inner'>
                      <RateHistoryChart width={500} height={240} />
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }

  // TODO @bshevchenko: MINT-129 New Exchange
  // noinspection JSUnusedGlobalSymbols
  renderRates() {
    const data = [
      {
        asset: 'ETH', btc: 11.01, usd: 10.01, eur: 10.01, color: '#FFFFFF',
      },
      {
        asset: 'LHT', btc: 11.01, usd: 10.01, eur: 10.01, color: '#0039CB',
      },
    ]

    return (
      <div styleName='ratesTable'>
        <div styleName='tableHead'>
          <div styleName='row'>
            <div styleName='colAsset'>Asset</div>
            <div styleName='colValue'>BTC</div>
            <div styleName='colValue'>USD</div>
            <div styleName='colValue'>EUR</div>
            <div styleName='colColor' />
          </div>
        </div>
        <div styleName='tableBody'>
          { data.map(item => this.renderRatesRow(item)) }
        </div>
      </div>
    )
  }

  renderRatesRow(item) {
    const [btc1, btc2] = (`${item.btc.toFixed(2)}`).split('.')
    const [usd1, usd2] = (`${item.usd.toFixed(2)}`).split('.')
    const [eur1, eur2] = (`${item.eur.toFixed(2)}`).split('.')

    return (
      <div styleName='row'>
        <div styleName='colAsset'>
          <i className='fa fa-money' />&nbsp;
          <span>{item.asset}</span>
        </div>
        <div styleName='colValue'>
          <span styleName='value'>
            <span styleName='value1'>{btc1}</span>
            <span styleName='value2'>{btc2}</span>
          </span>
        </div>
        <div styleName='colValue'>
          <span styleName='value'>
            <span styleName='value1'>{usd1}</span>
            <span styleName='value2'>{usd2}</span>
          </span>
        </div>
        <div styleName='colValue'>
          <span styleName='value'>
            <span styleName='value1'>{eur1}</span>
            <span styleName='value2'>{eur2}</span>
          </span>
        </div>
        <div styleName='colColor'>
          <span styleName='color' style={{ backgroundColor: item.color }} />
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    exchange: (order: ExchangeOrderModel, amount: BigNumber) => {
      dispatch(modalsClose())
      dispatch(exchange(order, amount))
    },
    handleClose: () => dispatch(modalsClose()),
  }
}

export default connect(null, mapDispatchToProps)(BuyTokensDialog)
