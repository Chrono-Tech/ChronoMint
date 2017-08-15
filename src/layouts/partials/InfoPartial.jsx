import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Paper } from 'material-ui'
import { AddCurrencyDialog, IPFSImage, TokenValue } from 'components'

import { modalsOpen } from 'redux/modals/actions'

import './InfoPartial.scss'

// TODO: @ipavlenko: MINT-234 - Remove when icon property will be implemented
const ICON_OVERRIDES = {
  ETH: require('assets/img/icn-ethereum.svg'),
  TIME: require('assets/img/icn-time.svg')
}

const SCREEN_WIDTH_SCALE = [
  { width: 1624, count: 5 },
  { width: 1344, count: 4 },
  { width: 1024, count: 3 },
  { width: 690, count: 2 },
  { width: 0, count: 1 },
]

export class InfoPartial extends React.Component {

  static propTypes = {
    account: PropTypes.string,
    profile: PropTypes.object,
    tokens: PropTypes.object,
    isTokensLoaded: PropTypes.bool,
    addCurrency: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      slideIndex: 0,
      visibleCount: 3
    }
  }

  componentDidMount () {
    this.resizeHandler = () => this.handleResize()
    this.resizeHandler()
    window.addEventListener('resize', this.resizeHandler)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resizeHandler)
    this.resizeHandler = null
  }

  render () {
    if (!this.props.isTokensLoaded) {
      return null
    }
    const tokens = this.props.tokens.entrySeq().toArray()
    const items = tokens.map(([name, token]) => ({
      token,
      name
    }))

    const showArrows = tokens.length + 1 > this.state.visibleCount

    return (
      <div styleName='root'>
        <div styleName='arrow arrow-left' style={{visibility: showArrows ? 'visible' : 'hidden'}}>
          <a styleName='arrow-action' onTouchTap={() => this.handleSlide(this.state.visibleCount)}>
            <i className='material-icons'>keyboard_arrow_left</i>
          </a>
        </div>
        <div styleName='wrapper'>
          <div styleName='gallery' style={{ transform: `translateX(${-280 * this.state.slideIndex}px)` }}>
            {items.map((item) => this.renderItem(item))}
            {this.renderAction()}
          </div>
        </div>
        <div styleName='arrow arrow-right' style={{visibility: showArrows ? 'visible' : 'hidden'}}>
          <a styleName='arrow-action' onTouchTap={() => this.handleSlide(this.state.visibleCount)}>
            <i className='material-icons'>keyboard_arrow_right</i>
          </a>
        </div>
      </div>
    )
  }

  renderItem ({token}) {
    const symbol = token.symbol()

    return (
      <div styleName='outer' key={token.id()}>
        <Paper zDepth={1} style={{background: 'transparent'}}>
          <div styleName='inner'>
            <div styleName='icon'>
              <IPFSImage styleName='content' multihash={token.icon()} fallback={ICON_OVERRIDES[symbol]} />
              <div styleName='label'>{symbol}</div>
            </div>
            <div styleName='info'>
              <div styleName='label'>Balance:</div>
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
      <div key='action' styleName='outer' onTouchTap={() => { this.props.addCurrency() }}>
        <Paper zDepth={1}>
          <div styleName='inner-action'>
            <div styleName='icon' />
            <div styleName='title'>
              <h3>Add Token</h3>
            </div>
          </div>
        </Paper>
      </div>
    )
  }

  calcVisibleCells (w) {
    for (let { width, count } of SCREEN_WIDTH_SCALE) {
      if (w >= width) {
        return count
      }
    }
  }

  handleResize () {
    const visibleCount = this.calcVisibleCells(window.screen.width)
    this.setState({
      slideIndex: 0,
      visibleCount
    })
  }

  handleSlide (diff) {
    const count = this.props.tokens.count()
    const total = count + 1
    const cells = (total % this.state.visibleCount === 0)
      ? total
      : ((parseInt(total / this.state.visibleCount) + 1) * this.state.visibleCount)

    const slideIndex = this.state.slideIndex + diff + cells
    this.setState({
      slideIndex: slideIndex % cells
    })
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addCurrency: () => dispatch(modalsOpen({
      component: AddCurrencyDialog
    }))
  }
}

function mapStateToProps (state) {
  let session = state.get('session')
  let wallet = state.get('wallet')

  return {
    account: session.account,
    profile: session.profile,
    isTokensLoaded: !wallet.tokensFetching,
    tokens: wallet.tokens
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoPartial)
