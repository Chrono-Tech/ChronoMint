import { AddCurrencyDialog } from 'components'
import { FloatingActionButton, Paper } from 'material-ui'
import TokensCollection from 'models/tokens/TokensCollection'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DUCK_MARKET, SET_SELECTED_COIN } from 'redux/market/action'
import { modalsOpen } from 'redux/modals/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import { OPEN_BRAND_PARTIAL } from 'redux/ui/reducer'
import { getCurrentWallet } from 'redux/wallet/actions'
import './InfoPartial.scss'
import SlideArrow from './SlideArrow'
import TokenItem from './TokenItem'

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

function mapDispatchToProps (dispatch) {
  return {
    addCurrency: () => dispatch(modalsOpen({
      component: AddCurrencyDialog,
    })),
    // TODO @dkchv: move to token redux and use token collection
    onChangeSelectedCoin: (symbol, open) => {
      dispatch({ type: SET_SELECTED_COIN, payload: { coin: symbol } })
      dispatch({ type: OPEN_BRAND_PARTIAL, payload: { open } })
    },
  }
}

function mapStateToProps (state) {
  const ui = state.get('ui')
  const wallet = getCurrentWallet(state)

  return {
    wallet,
    selectedCoin: state.get(DUCK_MARKET).selectedCoin,
    open: ui.open,
    balances: wallet.balances(),
    tokens: state.get(DUCK_TOKENS),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class InfoPartial extends PureComponent {
  static propTypes = {
    wallet: PropTypes.object,
    addCurrency: PropTypes.func,
    onChangeSelectedCoin: PropTypes.func,
    selectedCoin: PropTypes.string,
    open: PropTypes.bool,
    tokens: PropTypes.instanceOf(TokensCollection),
  }

  constructor () {
    super(...arguments)
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

  renderItem = (balance) => {
    const { selectedCoin, open, tokens } = this.props
    return (
      <TokenItem
        key={balance.id()}
        isSelected={balance.id() === selectedCoin && open}
        balance={balance.amount()}
        token={tokens.item(balance.id())}
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
          <div styleName='action'>
            <div styleName='actionIcon' />
            <div styleName='actionTitle'>
              <h3><Translate value='layouts.partials.InfoPartial.addToken' /></h3>
            </div>
          </div>
        </Paper>
      </div>
    )
  }

  render () {
    const { wallet } = this.props
    const { visibleCount } = this.state
    const balances = wallet.balances()
    const isMainWallet = !wallet.isMultisig()

    let slidesCount = balances.size()
    let withBigButton = false
    if (isMainWallet) {
      // increase 'add' button for main wallet
      slidesCount += 1
      // check
      withBigButton = slidesCount <= visibleCount
      // decrease if 'add' button don't fit the screen, cause 'add' button will be as FAB
      slidesCount = withBigButton ? slidesCount : slidesCount - 1
    }

    const showArrows = slidesCount > visibleCount

    return (
      <div styleName='root'>
        <div styleName='wrapper'>
          <div styleName='gallery' style={{ transform: `translateX(${-280 * this.state.slideIndex}px)` }}>
            {balances.items().map(this.renderItem)}
            {isMainWallet && withBigButton && this.renderAction()}
          </div>
        </div>
        {isMainWallet && !withBigButton && (
          <div styleName='addTokenFAB'>
            <FloatingActionButton onTouchTap={this.handleAddClick}>
              <div className='material-icons'>add</div>
            </FloatingActionButton>
          </div>
        )}
        <SlideArrow
          direction='left'
          show={showArrows}
          count={-visibleCount}
          onClick={this.handleSlide}
        />
        <SlideArrow
          direction='right'
          show={showArrows}
          count={visibleCount}
          onClick={this.handleSlide}
        />
      </div>
    )
  }
}
