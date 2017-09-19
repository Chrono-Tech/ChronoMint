import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './style.scss'

const mapStateToProps = (state) => {
  const {selectedCoin, rates} = state.get('market')
  return {
    rates: rates[selectedCoin + '/USD'] || {},
  }
}

@connect(mapStateToProps)
class Rates extends React.Component {
  static propTypes = {
    rates: PropTypes.object,
  }

  render () {
    const {rates} = this.props
    return (
      <div style={{width: '800px'}}>
        {
          Object.values(rates).map((market) => {
            const logoPath = require(`../../../assets/img/marketsLogos/${market.LASTMARKET.toLowerCase()}.png`)
            if (!market.PRICE) {
              return null
            }
            return <div styleName='market' key={market.LASTMARKET}>
              <div styleName='logo' style={{backgroundImage: `url(${logoPath})`}}/>
              <div styleName='marketInfo'>
                <div styleName='marketName'>{market.LASTMARKET}</div>
                <div styleName='price'>
                  {market.PRICE}&nbsp;<span styleName='currency'>USD</span>
                </div>
                <div styleName='changePct'>{(market.CHANGEPCT24H || 0).toFixed(5)}% <i styleName='changeIcon'/></div>
              </div>
            </div>
          })
        }
      </div>
    )
  }
}

export default Rates
