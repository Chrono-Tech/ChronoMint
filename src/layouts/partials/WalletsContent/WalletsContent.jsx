import { multisigWalletsSelector } from 'redux/wallet/selectors'
import { Wallet } from 'components'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'

import './WalletsContent.scss'
import { prefix } from './lang'

function mapDispatchToProps (dispatch) {
  return {}
}

const mapStateToProps = (state, ownProps) => {
  return {
    // walletsList: makeGetSectionedWallets()(state, ownProps),
    walletsList: multisigWalletsSelector()(state, ownProps),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletsContent extends Component {
  static propTypes = {
    walletsList: PropTypes.object,
  }

  render () {
    return (
      <div styleName='root'>
        {this.props.walletsList.map((wallet) => (
          <div styleName='header-container'>
            <h1 styleName='header-text'><Translate value={`${prefix}.walletTitle`} title={wallet.title} /></h1>
            <div styleName='wallet-list-container'>
              {wallet.data.map((walletData) => {
                return <Wallet blockchain={wallet.title} wallet={walletData.wallet} tokenTitle='ETH' address={walletData.address} />
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }
}
