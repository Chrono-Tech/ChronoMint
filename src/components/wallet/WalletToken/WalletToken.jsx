/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/core/dao/constants'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import MultisigEthWalletModel from '@chronobank/core/models/wallet/MultisigEthWalletModel'
import { TOKEN_ICONS } from 'assets'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import SubIconForWallet from '../SubIconForWallet/SubIconForWallet'
import './WalletToken.scss'

export default class WalletToken extends PureComponent {
  static propTypes = {
    blockchain: PropTypes.string,
    token: PropTypes.instanceOf(TokenModel),
    wallet: PropTypes.oneOfType([
      PropTypes.instanceOf(WalletModel),
      PropTypes.instanceOf(MultisigEthWalletModel),
    ]),
  }

  render () {
    const {
      blockchain,
      token,
      wallet,
    } =this.props

    const icon = token && token.icon && token.icon()
    const symbol = token && token.symbol && token.symbol()

    return (
      <div styleName='token-container'>
        { blockchain === BLOCKCHAIN_ETHEREUM
          && <SubIconForWallet wallet={wallet} />
        }
        <div styleName='token-icon'>
          <IPFSImage
            styleName='image'
            multihash={icon}
            fallback={TOKEN_ICONS[symbol] || TOKEN_ICONS.DEFAULT}
          />
        </div>
      </div>
    )
  }
}
