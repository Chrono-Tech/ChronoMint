import { AddCurrencyDialog, IPFSImage, TokenValue } from 'components'
import { FloatingActionButton, Paper } from 'material-ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Translate } from 'react-redux-i18n'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { modalsOpen } from 'redux/modals/actions'
import { OPEN_BRAND_PARTIAL } from 'redux/ui/reducer'
import { SET_SELECTED_COIN } from 'redux/market/action'
import { DUCK_WALLET, getCurrentWallet } from 'redux/wallet/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import Preloader from 'components/common/Preloader/Preloader'
import './InfoPartial.scss'

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
  const {account, profile} = state.get(DUCK_SESSION)
  const market = state.get('market')
  const ui = state.get('ui')

  return {
    account,
    profile,
    isInited: !!state.get(DUCK_WALLET).current,
    wallet: getCurrentWallet(state),
    selectedCoin: market.selectedCoin,
    open: ui.open,
  }
}

export class InfoPartial extends React.Component {
  static propTypes = {
    account: PropTypes.string,
    profile: PropTypes.object,
    wallet: PropTypes.object,
    addCurrency: PropTypes.func,
    onChangeSelectedCoin: PropTypes.func,
    selectedCoin: PropTypes.string,
    open: PropTypes.bool,
    isInited: PropTypes.bool,
  }

  constructor (props) {
    super(props)
    this.state = {
      slideIndex: 0,
      visibleCount: 3,
    }
  }

  componentDidMount () {
    this.resizeHandler = () => this.handleResize()
    this.handleResize()
    window.addEventListener('resize', this.resizeHandler)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resizeHandler)
    this.resizeHandler = null
  }

  handleChangeSelectedCoin (newCoin) {
    const { selectedCoin, open } = this.props
    const openFlag = selectedCoin !== newCoin ? true : !open
    this.props.onChangeSelectedCoin(newCoin, openFlag)
  }

  render () {
    const { isInited, wallet } = this.props
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
            {isInited
              ? items.map(item => this.renderItem(item))
              : <Preloader />
            }
            {!this.props.wallet.isMultisig() && withBigButton && this.renderAction()}
          </div>
        </div>
        {!withBigButton && (
          <div styleName='addTokenFAB'>
            <FloatingActionButton onTouchTap={() => this.props.addCurrency()}>
              <div className='material-icons'>add</div>
            </FloatingActionButton>
          </div>
        )}
        <div styleName='arrow arrowLeft' style={{ visibility: showArrows ? 'visible' : 'hidden' }}>
          <a styleName='arrowAction' onTouchTap={() => this.handleSlide(-visibleCount)}>
            <i className='material-icons'>keyboard_arrow_left</i>
          </a>
        </div>
        <div styleName='arrow arrowRight' style={{ visibility: showArrows ? 'visible' : 'hidden' }}>
          <a styleName='arrowAction' onTouchTap={() => this.handleSlide(visibleCount)}>
            <i className='material-icons'>keyboard_arrow_right</i>
          </a>
        </div>
      </div>
    )
  }

  renderItem ({ token }) {
    const symbol = token.symbol()
    const { selectedCoin, open } = this.props

    return (
      <div
        styleName={classnames('outer', { selected: selectedCoin === symbol && open })}
        key={token.id()}
        onTouchTap={() => this.handleChangeSelectedCoin(symbol)}
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

  renderAction () {
    return (
      <div
        key='action'
        styleName='outer'
        onTouchTap={() => this.props.addCurrency()}
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

  calcVisibleCells (w) {
    for (const { width, count } of SCREEN_WIDTH_SCALE) {
      if (w >= width) {
        return count
      }
    }
  }

  handleResize () {
    const visibleCount = this.calcVisibleCells(window.innerWidth)
    this.setState({
      slideIndex: 0,
      visibleCount,
    })
  }

  handleSlide (diff) {
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
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoPartial)
