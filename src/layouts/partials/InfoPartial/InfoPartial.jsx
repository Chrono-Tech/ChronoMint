import { AddCurrencyDialog, IPFSImage, TokenValue } from 'components'
import { FloatingActionButton, Paper } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { DUCK_SESSION } from 'redux/session/actions'
import { DUCK_WALLET, getCurrentWallet } from 'redux/wallet/actions'
import { modalsOpen } from 'redux/modals/actions'
import { OPEN_BRAND_PARTIAL } from 'redux/ui/reducer'
import { DUCK_MARKET, SET_SELECTED_COIN } from 'redux/market/action'
import Preloader from 'components/common/Preloader/Preloader'

import './InfoPartial.scss'

class SlideArrow extends PureComponent {

  static propTypes = {
    show: PropTypes.bool,
    count: PropTypes.number,
    onClick: PropTypes.func,
  }

  handleClick = () => this.props.onClick(this.props.count)

  render () {
    return (
      <div styleName='arrow arrowLeft' style={{ visibility: this.props.show ? 'visible' : 'hidden' }}>
        <a href='#arrow' styleName='arrowAction' onTouchTap={this.handleClick}>
          <i className='material-icons'>keyboard_arrow_left</i>
        </a>
      </div>
    )
  }
}

class TokenItem extends PureComponent {

  static propTypes = {
    selectedCoin: PropTypes.string,
    token: PropTypes.object,
    open: PropTypes.bool,
    onClick: PropTypes.func,
  }

  handleClick = () => this.props.onClick(this.props.token.symbol())

  render () {
    const {
      token,
      selectedCoin,
      open,
    } = this.props
    const symbol = token.symbol()

    return (
      <div
        styleName={classnames('outer', { selected: selectedCoin === symbol && open })}
        onTouchTap={this.handleClick}
      >
        <Paper zDepth={1} style={{ background: 'transparent' }}>
          <div styleName='inner'>
            <div styleName='innerIcon'>
              <IPFSImage styleName='content' multihash={token.icon()} fallback={ICON_OVERRIDES[symbol]} />
              <div styleName='innerIconLabel'>{symbol}</div>
            </div>
            <div styleName='info'>
              <div styleName='infoLabel'><Translate value={prefix('balance')} />:</div>
              <TokenValue
                value={token.balance()}
                symbol={symbol}
              />
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}

// TODO: @ipavlenko: MINT-234 - Remove when icon property will be implemented
const ICON_OVERRIDES = {
  ETH: require('assets/img/icn-ethereum.svg'),
  BTC: require('assets/img/icn-bitcoin.svg'),
  BCC: require('assets/img/icn-bitcoin-cash.svg'),
  TIME: require('assets/img/icn-time.svg'),
}

const SCREEN_WIDTH_SCALE = [
  { width: 1624, count: 5 },
  { width: 1344, count: 4 },
  { width: 1024, count: 3 },
  { width: 690, count: 2 },
  { width: 0, count: 1 },
]

const calcVisibleCells = (w) => {
  for (const { width, count } of SCREEN_WIDTH_SCALE) {
    if (w >= width) {
      return count
    }
  }
}

function prefix (token) {
  return `layouts.partials.InfoPartial.${token}`
}

function mapDispatchToProps (dispatch) {
  return {
    addCurrency: () => dispatch(modalsOpen({
      component: AddCurrencyDialog,
    })),
    onChangeSelectedCoin: (symbol, open) => {
      dispatch({ type: SET_SELECTED_COIN, payload: { coin: symbol } })
      dispatch({ type: OPEN_BRAND_PARTIAL, payload: { open } })
    },
  }
}

function mapStateToProps (state) {
  const { account, profile } = state.get(DUCK_SESSION)
  const ui = state.get('ui')
  const wallet = getCurrentWallet(state)

  return {
    account,
    profile,
    wallet,
    selectedCoin: state.get(DUCK_MARKET).selectedCoin,
    open: ui.open,
  }
}

export class InfoPartial extends PureComponent {
  static propTypes = {
    account: PropTypes.string,
    profile: PropTypes.object,
    wallet: PropTypes.object,
    addCurrency: PropTypes.func,
    onChangeSelectedCoin: PropTypes.func,
    selectedCoin: PropTypes.string,
    open: PropTypes.bool,
  }

  constructor (props, context, updater) {
    super(props, context, updater)
    this.state = {
      slideIndex: 0,
      visibleCount: 3,
    }
  }

  componentDidMount () {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  handleActionClick = () => this.props.addCurrency()

  handleAddClick = () => this.props.addCurrency()

  handleChangeSelectedCoin = (newCoin) => {
    const { selectedCoin, open } = this.props
    const openFlag = selectedCoin !== newCoin ? true : !open
    this.props.onChangeSelectedCoin(newCoin, openFlag)
  }

  handleSlide = (diff) => {
    const count = this.props.wallet.tokens().count()
    const total = count + 1 <= this.state.visibleCount ? count + 1 : count
    const cells = (total % this.state.visibleCount === 0)
      ? total
      : ((parseInt(total / this.state.visibleCount) + 1) * this.state.visibleCount)

    const slideIndex = this.state.slideIndex + diff + cells
    this.setState({
      slideIndex: slideIndex % cells,
    })
  }

  handleResize = () => {
    const visibleCount = calcVisibleCells(window.innerWidth)
    this.setState({
      slideIndex: 0,
      visibleCount,
    })
  }

  renderItem = ({ token }) => {
    const { selectedCoin, open } = this.props

    return (
      <TokenItem
        key={token.id()}
        selectedCoin={selectedCoin}
        token={token}
        open={open}
        onClick={this.handleChangeSelectedCoin}
      />
    )
  }

  renderAction () {
    return (
      <div
        key='action'
        styleName='outer'
        onTouchTap={this.handleActionClick}
      >
        <Paper zDepth={1}>
          <div styleName='innerAction'>
            <div styleName='actionIcon' />
            <div styleName='actionTitle'>
              <h3><Translate value={prefix('addToken')} /></h3>
            </div>
          </div>
        </Paper>
      </div>
    )
  }

  render () {
    const { wallet } = this.props
    const { visibleCount } = this.state
    const tokens = wallet.tokens().entrySeq().toArray()
    const items = tokens.map(([name, token]) => ({ token, name }))

    const tokensCount = this.props.wallet.isMultisig() ? tokens.length : tokens.length + 1
    const withBigButton = tokensCount <= visibleCount
    const showArrows = withBigButton
      ? tokensCount + 1 > visibleCount
      : tokensCount > visibleCount

    return (
      <div styleName='root'>
        <div styleName='wrapper'>
          <div styleName='gallery' style={{ transform: `translateX(${-280 * this.state.slideIndex}px)` }}>
            {wallet.isFetched() && !wallet.isFetching()
              ? items.map(this.renderItem)
              : <Preloader />
            }
            {!this.props.wallet.isMultisig() && withBigButton && this.renderAction()}
          </div>
        </div>
        {!withBigButton && (
          <div styleName='addTokenFAB'>
            <FloatingActionButton onTouchTap={this.handleAddClick}>
              <div className='material-icons'>add</div>
            </FloatingActionButton>
          </div>
        )}
        <SlideArrow
          show={showArrows}
          count={-visibleCount}
          onClick={this.handleSlide}
        />
        <SlideArrow
          show={showArrows}
          count={visibleCount}
          onClick={this.handleSlide}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoPartial)
