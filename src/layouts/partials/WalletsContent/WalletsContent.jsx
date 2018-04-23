import { walletsSelector } from 'redux/wallet/selectors'
import { WalletWidget } from 'components'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import MainWalletModel from 'models/wallet/MainWalletModel'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'

import './WalletsContent.scss'

function mapDispatchToProps (dispatch) {
  return {}
}

const mapStateToProps = (state, ownProps) => {
  return {
    walletsList: walletsSelector()(state, ownProps),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletsContent extends Component {
  static propTypes = {
    walletsList: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        address: PropTypes.string,
        wallet: PropTypes.instanceOf(MainWalletModel || MultisigWalletModel),
      }),
    ),
  }

  render () {
    return (
      <div styleName='root'>
        {this.props.walletsList.map((wallet) => (
          <WalletWidget key={`${wallet.address}-${wallet.title}`} blockchain={wallet.title} wallet={wallet.wallet} address={wallet.address} />
        ))}
      </div>
    )
  }
}
