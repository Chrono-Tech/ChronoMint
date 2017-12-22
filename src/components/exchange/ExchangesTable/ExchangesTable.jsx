import Preloader from 'components/common/Preloader/Preloader'
import TokenValue from 'components/common/TokenValue/TokenValue'
import BuyTokensDialog from 'components/exchange/BuyTokensDialog/BuyTokensDialog'
import Immutable from 'immutable'
import { RaisedButton, Toggle } from 'material-ui'
import type ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import ExchangesCollection from 'models/exchange/ExchangesCollection'
import PropTypes from 'prop-types'
import React from 'react'
import globalStyles from 'layouts/partials/styles'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import Amount from 'models/Amount'
import { DUCK_EXCHANGE, getNextPage } from 'redux/exchange/actions'
import { modalsOpen } from 'redux/modals/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import TokensCollection from 'models/tokens/TokensCollection'
import './ExchangesTable.scss'
import ExchangeTransferDialog from '../ExchangeTransferDialog/ExchangeTransferDialog'

function prefix (token) {
  return `components.exchange.OrdersTable.${token}`
}

function mapStateToProps (state) {
  const exchange = state.get(DUCK_EXCHANGE)
  const tokens = state.get(DUCK_TOKENS)
  return {
    tokens,
    exchanges: exchange.exchanges(),
    exchangesForOwner: exchange.exchangesForOwner(),
    pagesCount: exchange.pagesCount(),
    lastPages: exchange.lastPages(),
    showFilter: exchange.showFilter(),
    filter: exchange.filter(),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleOpenDetails: (exchange: ExchangeOrderModel, isBuy: boolean) => dispatch(modalsOpen({
      component: BuyTokensDialog,
      props: {
        exchange,
        isBuy,
      },
    })),
    handleOpenTransfer: (exchange: ExchangeOrderModel, tokenSymbol: string) => dispatch(modalsOpen({
      component: ExchangeTransferDialog,
      props: {
        exchange,
        tokenSymbol,
      },
    })),
    handleGetNextPage: () => dispatch(getNextPage()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ExchangesTable extends React.PureComponent {
  static propTypes = {
    exchanges: PropTypes.instanceOf(ExchangesCollection),
    exchangesForOwner: PropTypes.instanceOf(ExchangesCollection),
    tokens: PropTypes.instanceOf(TokensCollection),
    handleOpenDetails: PropTypes.func,
    handleOpenTransfer: PropTypes.func,
    filter: PropTypes.instanceOf(Immutable.Map),
    showFilter: PropTypes.bool,
    handleGetNextPage: PropTypes.func,
    pagesCount: PropTypes.number,
    lastPages: PropTypes.number,
  }

  constructor (args) {
    super(args)

    this.state = {
      showMyExchanges: false,
    }
  }

  handleShowMyExchanges = (e: Object, isInputChecked: boolean) => {
    this.setState({ showMyExchanges: isInputChecked })
  }

  renderMyExchanges (exchange: ExchangeOrderModel) {
    return (
      <div styleName='row' key={exchange.id()}>
        <div styleName='values'>
          <div styleName='colTrader'>
            <span styleName='rowTitle'><Translate value={prefix('exchangeAddress')} />: </span>
            {exchange.isPending() ?
              <div>
                <div styleName='ellipsis'>{exchange.id()}</div>
                <div><Translate value={prefix('statusPending')} /></div>
              </div>
              :
              <div styleName='ellipsis'>{exchange.address()}</div>
            }
          </div>
          <div styleName='colPrice'>
            <div styleName='colWrapper'>
              <span styleName='rowTitle'><Translate value={prefix('buyPrice')} />: </span>
              <TokenValue value={new Amount(exchange.sellPrice(), 'ETH')} />
            </div>
            <div styleName='colWrapper'>
              <span styleName='rowTitle'><Translate value={prefix('sellPrice')} />: </span>
              <TokenValue value={new Amount(exchange.buyPrice(), 'ETH')} />
            </div>
          </div>
          <div styleName='colLimits'>
            <div styleName='colWrapper'>
              <span styleName='rowTitle'><Translate value={prefix('buyLimits')} />: </span>
              <TokenValue value={new Amount(exchange.assetBalance(), exchange.symbol())} noRenderPrice />
            </div>
            <div styleName='colWrapper'>
              <span styleName='rowTitle'><Translate value={prefix('sellLimits')} />: </span>
              <TokenValue value={new Amount(exchange.ethBalance(), 'ETH')} noRenderPrice />
            </div>
          </div>
        </div>
        {!exchange.isPending() ?
          <div styleName='colActions'>
            <div styleName='buttonWrapper'>
              <RaisedButton
                label={(
                  <span styleName='buttonLabel'>
                    <Translate value={prefix('depositTokens')} symbol={exchange.symbol()} />
                  </span>)}
                onTouchTap={() => {
                  this.props.handleOpenTransfer(exchange, exchange.symbol())
                }}
                {...globalStyles.buttonRaisedMultyLine}
              />
            </div>
            <div styleName='buttonWrapper'>
              <RaisedButton
                label={<span styleName='buttonLabel'><Translate value={prefix('depositEth')} /></span>}
                onTouchTap={() => {
                  this.props.handleOpenTransfer(exchange, 'ETH')
                }}
                {...globalStyles.buttonRaisedMultyLine}
              />
            </div>
          </div>
          : <div styleName='colActions'><Preloader /></div>
        }
      </div>
    )
  }

  renderRow (exchange: ExchangeOrderModel) {
    if (exchange.assetBalance() <= 0 && exchange.ethBalance() <= 0) {
      return null
    }

    const filterMode = this.props.filter.get('filterMode')
    let showBuy = true
    let showSell = true
    if (filterMode) {
      showBuy = filterMode.name === 'BUY'
      showSell = filterMode.name === 'SELL'
    }
    return (
      <div styleName='row' key={exchange.id()}>
        <div styleName='values'>
          <div styleName='colTrader'>
            <span styleName='rowTitle'><Translate value={prefix('exchangeAddress')} />: </span>
            <div styleName='ellipsis'>{exchange.address()}</div>
          </div>
          <div styleName='colPrice'>
            {showBuy && exchange.assetBalance() > 0 &&
            <div styleName='colWrapper'>
              <span styleName='rowTitle'><Translate value={prefix('buyPrice')} />: </span>
              <TokenValue value={new Amount(exchange.sellPrice(), 'ETH')} />
            </div>
            }
            {showSell && exchange.ethBalance() > 0 &&
            <div styleName='colWrapper'>
              <span styleName='rowTitle'><Translate value={prefix('sellPrice')} />: </span>
              <TokenValue value={new Amount(exchange.buyPrice(), 'ETH')} />
            </div>
            }
          </div>
          <div styleName='colLimits'>
            {showBuy && exchange.assetBalance() > 0 &&
            <div styleName='colWrapper'>
              <span styleName='rowTitle'><Translate value={prefix('buyLimits')} />: </span>
              <TokenValue value={new Amount(exchange.assetBalance(), exchange.symbol())} noRenderPrice />
            </div>
            }
            {showSell && exchange.ethBalance() > 0 &&
            <div styleName='colWrapper'>
              <span styleName='rowTitle'><Translate value={prefix('sellLimits')} />: </span>
              <TokenValue value={new Amount(exchange.ethBalance(), 'ETH')} noRenderPrice />
            </div>
            }
          </div>
        </div>
        <div styleName='colActions'>
          {showBuy && exchange.assetBalance() > 0 &&
          <div styleName='buttonWrapper'>
            <RaisedButton
              label={<span><Translate value={prefix('buy')} /> {exchange.symbol()}</span>}
              onTouchTap={() => {
                this.props.handleOpenDetails(exchange, true)
              }}
            />
          </div>
          }
          {showSell && exchange.ethBalance() > 0 &&
          <div styleName='buttonWrapper'>
            <RaisedButton
              label={<span><Translate value={prefix('sell')} /> {exchange.symbol()}</span>}
              onTouchTap={() => {
                this.props.handleOpenDetails(exchange, false)
              }}
            />
          </div>
          }
        </div>
      </div>
    )
  }

  renderFooter () {

    if (this.state.showMyExchanges) return null

    if (this.props.exchanges.isFetching()) {
      return <Preloader />
    }

    if (this.props.exchanges.isFetched() && this.props.lastPages < this.props.pagesCount) {
      return (
        <RaisedButton
          label={<Translate value={prefix('getNextPage')} />}
          primary
          onTouchTap={this.props.handleGetNextPage}
        />
      )
    }

    return null
  }

  render () {
    let filteredItems
    const amount = this.props.filter.get('amount')
    if (this.state.showMyExchanges) {

      filteredItems = this.props.exchangesForOwner.items()

    } else if (this.props.filter.get('filterMode') && amount > 0) {

      filteredItems = this.props.exchanges.items()
        .filter((item: ExchangeOrderModel) => {
          if (this.props.filter.get('filterMode').name === 'BUY') {
            return amount < item.assetBalance().toNumber()
          } else {
            return amount < item.ethBalance().toNumber()
          }
        })

    } else {
      filteredItems = this.props.exchanges.items()
    }

    return (
      <div styleName='root'>
        <div styleName='header'>
          <div styleName='title'><Translate value={prefix('orderBook')} /></div>
        </div>
        <div styleName='content'>
          <div styleName='actionsWrapper'>
            <Toggle
              label={<Translate value={prefix('showOnlyMyExchanges')} />}
              style={{ width: 'auto' }}
              onToggle={this.handleShowMyExchanges}
            />
          </div>
          <div styleName='table'>
            <div styleName='tableHead'>
              <div styleName='tableHeadRow'>
                <div styleName='values'>
                  <div styleName='colTrader'><Translate value={prefix('exchangeAddress')} /></div>
                  <div styleName='colPrice'><Translate value={prefix('price')} /></div>
                  <div styleName='colLimits'><Translate value={prefix('limits')} /></div>
                </div>
                <div styleName='colActions' />
              </div>
            </div>
            <div styleName='tableBody'>
              {
                this.props.exchanges.isFetched() && filteredItems
                  .sort(function (a, b) {
                    if (a.isPending()) return -1
                    if (b.isPending()) return 1
                    return 0
                  })
                  .map((exchange) =>
                    this.state.showMyExchanges
                      ? this.renderMyExchanges(exchange)
                      : this.renderRow(exchange))
              }
            </div>
            <div styleName='tableFooter'>
              {this.renderFooter()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

