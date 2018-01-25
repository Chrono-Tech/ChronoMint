import { MANDATORY_TOKENS } from 'dao/ERC20ManagerDAO'
import { AddCurrencyDialog } from 'components'
import Preloader from 'components/common/Preloader/Preloader'
import TokenPlaceHolder from 'layouts/partials/InfoPartial/TokenPlaceHolder'
import { FloatingActionButton, Paper } from 'material-ui'
import BalanceModel from 'models/tokens/BalanceModel'
import BalancesCollection from 'models/tokens/BalancesCollection'
import TokensCollection from 'models/tokens/TokensCollection'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DUCK_MARKET, SET_SELECTED_COIN } from 'redux/market/action'
import { modalsOpen } from 'redux/modals/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import ProfileModel from 'models/ProfileModel'
import { checkToken } from 'components/dialogs/tokens/AddCurrencyDialog'
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
  const session = state.get(DUCK_SESSION)

  return {
    profile: session.profile,
    isMultisig: wallet.isMultisig(),
    isPending: wallet.isPending(),
    selectedCoin: state.get(DUCK_MARKET).selectedCoin,
    open: ui.open,
    balances: wallet.balances(),
    tokens: state.get(DUCK_TOKENS),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class InfoPartial extends PureComponent {
  static propTypes = {
    profile: PropTypes.instanceOf(ProfileModel),
    addCurrency: PropTypes.func,
    onChangeSelectedCoin: PropTypes.func,
    selectedCoin: PropTypes.string,
    open: PropTypes.bool,
    tokens: PropTypes.instanceOf(TokensCollection),
    isMultisig: PropTypes.bool,
    balances: PropTypes.instanceOf(BalancesCollection),
    isPending: PropTypes.bool,
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
    const { balances, tokens } = this.props
    const { visibleCount } = this.state

    const filteredBalances = balances.filter(this.filterCallback)
    const count = filteredBalances.toArray().length + tokens.leftToFetch()
    const total = count + 1 <= visibleCount ? count + 1 : count
    const cells = (total % visibleCount === 0)
      ? total
      : ((parseInt(total / visibleCount) + 1) * visibleCount)

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

  filterCallback = (balance) => {
    const { tokens, profile } = this.props
    const token = tokens.item(balance.symbol())
    let profileToken
    profile.tokens().map((item) => {
      if (token && checkToken(token, item)) {
        profileToken = item
      }
    })

    if (MANDATORY_TOKENS.includes(token.symbol())) {
      return true
    }

    return profileToken ? profileToken.show : !token.isOptional()
  }

  renderItem = (balance: BalanceModel) => {
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

  renderPlaceHolders (count) {
    const placeHolders = []
    for (let i = 0; i < count; i++) {
      placeHolders.push(<TokenPlaceHolder key={i} />)
    }
    return placeHolders
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
    const { balances, isMultisig, tokens, isPending } = this.props
    const { visibleCount } = this.state
    const leftToFetch = tokens.leftToFetch()

    const filteredBalances = balances.filter(this.filterCallback)
    let slidesCount = filteredBalances.toArray().length
    let withBigButton = false
    if (!isMultisig) {
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
            {isPending
              ? <Preloader />
              : filteredBalances
                .sortBy((balance) => balance.symbol())
                .map(this.renderItem)}
            {leftToFetch > 0 && this.renderPlaceHolders(leftToFetch)}
            {!isMultisig && withBigButton && this.renderAction()}
          </div>
        </div>
        {!isMultisig && !withBigButton && (
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
