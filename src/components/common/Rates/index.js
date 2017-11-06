import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import defaultLogo from 'assets/img/marketsLogos/default-logo.svg'

import './style.scss'

const mapStateToProps = (state) => {
  const { selectedCoin, rates } = state.get('market')
  return {
    rates: rates[selectedCoin] || {},
    selectedCoin,
  }
}

@connect(mapStateToProps)
class Rates extends PureComponent {
  static propTypes = {
    rates: PropTypes.object,
    selectedCoin: PropTypes.string,
  }

  constructor (props) {
    super(props)
    this.direction = true
  }

  componentDidMount () {
    this.go()
  }

  componentWillReceiveProps (newProps) {
    if (newProps.selectedCoin !== this.props.selectedCoin) this.go()
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  go () {
    const diff = 200
    this.track.style.left = '0'
    this.track.style.transition = ''

    setTimeout(() => {
      const trackWidth = this.track.offsetWidth
      const parentWidth = this.track.parentNode.offsetWidth
      if (trackWidth > parentWidth) {
        this.track.style.left = `-${diff}px`
        this.track.style.transition = 'left 5s linear'
      }
    }, 10)

    clearInterval(this.interval)
    this.interval = setInterval(() => {
      const left = parseInt(this.track.style.left) || 0
      const trackWidth = this.track.offsetWidth
      const parentWidth = this.track.parentNode.offsetWidth

      if (trackWidth > parentWidth) {
        this.track.style.transition = 'left 5s linear'
      } else {
        return
      }

      if (this.direction) {
        this.track.style.left = `${left - diff}px`
        if ((trackWidth + left - diff) < parentWidth) {
          this.direction = false
        }
      } else {
        this.track.style.left = `${left + diff}px`
        if ((left + diff) > 0) {
          this.direction = true
        }
      }
    }, 4000)
  }

  render () {
    const { rates, selectedCoin } = this.props
    return (
      <div style={{ width: '100%' }}>
        <div styleName='header'><span>{selectedCoin}</span><span>/USD</span></div>
        <div styleName='wrapper'>
          <div styleName='track' ref={(ref) => this.track = ref}>
            {
              Object.values(rates).map((market) => {
                let logoPath
                try {
                  logoPath = require(`../../../assets/img/marketsLogos/${market.LASTMARKET.toLowerCase()}.png`)
                } catch (e) {
                  logoPath = defaultLogo
                }

                if (!market.PRICE) {
                  return null
                }
                return (<div styleName='market' key={market.LASTMARKET}>
                  <div styleName='logo'>
                    <img src={logoPath} alt='' />
                  </div>
                  <div styleName='marketInfo'>
                    <div styleName='marketName'>{market.LASTMARKET}</div>
                    <div styleName='price'>
                      {market.PRICE}&nbsp;<span styleName='currency'>USD</span>
                    </div>
                    <div styleName={classnames('changePct', {
                      up: (market.CHANGEPCT24H || 0) > 0,
                      down: (market.CHANGEPCT24H || 0) <= 0,
                    })}
                    >{(market.CHANGEPCT24H || 0).toFixed(5)}% <i styleName='changeIcon' />
                    </div>
                  </div>
                </div>)
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Rates
