import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Paper, FloatingActionButton, FontIcon } from 'material-ui'

import { AddCurrencyDialog } from 'components'
import { modalsOpen } from 'redux/modals/actions'

import './InfoPartial.scss'

// TODO: @ipavlenko: MINT-234 - Remove when icon property will be implemented
const ICON_OVERRIDES = {
  ETH: require('assets/img/icn-eth.png'),
  LHUS: require('assets/img/icn-lhus.png'),
  TIME: require('assets/img/icn-time.png')
}

export class InfoPartial extends React.Component {

  static propTypes = {
    account: PropTypes.string,
    profile: PropTypes.object,
    tokens: PropTypes.object,
    isTokensLoaded: PropTypes.bool,
    addCurrency: PropTypes.func
  }

  render() {

    if (!this.props.isTokensLoaded) return null

    let tokens = this.props.tokens.entrySeq().toArray()

    let items = tokens.map(([name, token]) => ({
      selected: this.props.profile.tokens().contains(name),
      token: token,
      name: name
    }))

    return (
      <div styleName="root">
        { items.filter((item) => item.selected).map((item) => this.renderItem(item)) }
        <div styleName="actions">
          { this.renderAction({ icon: 'add' })}
        </div>
      </div>
    )
  }

  renderItem({ name, token }) {

    let icon = token.icon() || ICON_OVERRIDES[name.toUpperCase()]
    let [value1, value2] = ('' + (token.balance() || 0).toFixed(8)).split('.')

    return (
      <div styleName="outer">
        <Paper zDepth={1}>
          <div styleName="inner">
            <div styleName="icon" style={{ backgroundImage: `url("${icon}")` }}></div>
            <div styleName="title">{name}</div>
            <div styleName="value">
              <span styleName="value1">{value1}</span>
              <span styleName="value2">.{value2}</span>
            </div>
          </div>
        </Paper>
      </div>
    )
  }

  renderAction({ icon }) {
    return (
      <div styleName="item">
        <FloatingActionButton onTouchTap={() => { this.props.addCurrency() }}>
          <FontIcon className="material-icons">{icon}</FontIcon>
        </FloatingActionButton>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addCurrency: (data) => dispatch(modalsOpen({
      component: AddCurrencyDialog,
      data
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
