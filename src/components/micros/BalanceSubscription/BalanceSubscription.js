import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { subscribeWallet, unsubscribeWallet } from '@chronobank/core/redux/mainWallet/actions'
import { PTWallet } from '@chronobank/core/redux/wallet/types'

function mapDispatchToProps (dispatch) {
  return {
    async handleSubscribe ({ pocket }) {
      return dispatch(subscribeWallet({ pocket }))
    },
    async handleUnsubscribe ({ pocket, listener }) {
      await dispatch(unsubscribeWallet({ pocket, listener }))
    },
  }
}

@connect(null, mapDispatchToProps)(BalanceSubscription)
export default class BalanceSubscription extends React.Component {
  static propTypes = {
    handleSubscribe: PropTypes.func,
    handleUnsubscribe: PropTypes.func,
    wallet: PTWallet,
    children: PropTypes.node,
  }

  async componentDidMount () {
    const { wallet } = this.props
    if (wallet != null) {
      this.subscription = {
        wallet,
        listener: await this.props.handleSubscribe({
          wallet,
        }),
      }
    }
  }

  async componentWillUnmount () {
    if (this.subscription) {
      const { pocket, listener } = this.subscription
      await this.props.handleUnsubscribe({ pocket, listener })
      this.subscriptions = null
    }
  }

  render () {
    return this.props.children
  }
}

