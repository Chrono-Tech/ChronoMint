/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { subscribeWallet, unsubscribeWallet } from '@chronobank/core/redux/wallets/actions'
import { PTWallet } from '@chronobank/core/redux/wallet/types'

function mapDispatchToProps (dispatch) {
  return {
    async handleSubscribe ({ wallet }) {
      return dispatch(subscribeWallet({ wallet }))
    },
    async handleUnsubscribe ({ wallet, listener }) {
      await dispatch(unsubscribeWallet({ wallet, listener }))
    },
  }
}

@connect(null, mapDispatchToProps)
export default class BalanceSubscription extends Component {
  static propTypes = {
    handleSubscribe: PropTypes.func,
    handleUnsubscribe: PropTypes.func,
    wallet: PTWallet,
    children: PropTypes.node,
  }

  async componentDidMount () {
    const { wallet } = this.props

    if (wallet != null) {
      const listener = await this.props.handleSubscribe({
        wallet,
      })
      this.subscription = {
        wallet,
        listener,
      }

    }
  }

  async componentWillUnmount () {
    if (this.subscription) {
      const { wallet, listener } = this.subscription
      await this.props.handleUnsubscribe({ wallet, listener })
      this.subscriptions = null
    }
  }

  render () {
    return this.props.children
  }
}

