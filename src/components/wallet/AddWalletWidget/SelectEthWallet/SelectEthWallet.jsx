/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { createNewChildAddress, goToWallets, resetWalletsForm } from '@chronobank/core/redux/mainWallet/actions'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/core/dao/constants'
import './SelectEthWallet.scss'
import { prefix } from '../lang'

function mapStateToProps () {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    onCreateWallet: () => {
      dispatch(createNewChildAddress({ blockchain: BLOCKCHAIN_ETHEREUM }))
      dispatch(goToWallets())
      dispatch(resetWalletsForm())
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SelectEthWallet extends PureComponent {
  static propTypes = {
    handleTouchTap: PropTypes.func,
    onCreateWallet: PropTypes.func,
  }

  handleTouchTap = (type) => () => {
    if (!type.disabled) {
      this.props.handleTouchTap(type.type)
    }
  }

  handleCreateWallet = () => {
    this.props.onCreateWallet()
  }

  render () {
    const wallets = [
      {
        title: `${prefix}.st.title`,
        type: 'ST',
        icon: 'wallet-circle',
        description: `${prefix}.st.description`,
      },
      {
        title: `${prefix}.tl.title`,
        type: 'TL',
        icon: 'time-lock',
        description: `${prefix}.tl.description`,
      },
      {
        title: `${prefix}.fa.title`,
        type: '2FA',
        icon: 'security-circle',
        description: `${prefix}.fa.description`,
        disabled: true,
      },
      {
        title: `${prefix}.ms.title`,
        type: 'MS',
        icon: 'multisig',
        description: `${prefix}.ms.description`,
      },
      {
        title: `${prefix}.cw.title`,
        type: 'CW',
        icon: 'advanced-circle',
        description: `${prefix}.cw.description`,
      },
    ]

    return (
      <div styleName='root'>
        {
          wallets.map((type) => (
            <div key={type.type} styleName={classnames('walletType', { 'notAllowed': type.disabled })} onClick={type.action || this.handleTouchTap(type)}>
              <div styleName='icon'><i className='chronobank-icon'>{type.icon}</i></div>
              <div styleName='info'>
                <div styleName='title'><Translate value={type.title} /></div>
                <div styleName='description'><Translate value={type.description} /></div>
                {type.disabled && <div styleName='soon'><Translate value={`${prefix}.soon`} /></div>}
              </div>
              <div styleName='arrow'><i className='chronobank-icon'>next</i></div>
            </div>
          ))
        }
      </div>
    )
  }
}
