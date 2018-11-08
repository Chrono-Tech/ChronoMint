/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import classnames from 'classnames'
import { Translate } from 'react-redux-i18n'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { TOKEN_ICONS } from 'assets'
import {
  BLOCKCHAIN_ETHEREUM,
  ETH,
} from '@chronobank/core/dao/constants'
import { getBlockchainList } from '@chronobank/core/redux/persistAccount/selectors'
import { prefix } from '../lang'

import './SelectAssetType.scss'

function mapStateToProps (state) {
  return {
    blockchains: getBlockchainList(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {

  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SelectAssetType extends PureComponent {
  static propTypes = {
    blockchains: PropTypes.arrayOf(PropTypes.string),
    handleTouchTap: PropTypes.func,
  }

  handleTouchTap = (type) => () => {
    if (!type.disabled) {
      this.props.handleTouchTap(type.blockchain)
    }
  }

  wallets = [
    {
      blockchain: BLOCKCHAIN_ETHEREUM,
      symbol: ETH,
      title: `${prefix}.eth`,
      disabled: false,
    },
  ]

  render () {
    const { blockchains } = this.props

    return (
      <div styleName='root'>
        {
          this.wallets
            .filter(({ blockchain }) => blockchains.includes(blockchain))
            .map((type) => (
              <div key={type.blockchain} styleName={classnames('walletType', { 'disabled': type.disabled })} onClick={type.action || this.handleTouchTap(type)}>
                <div styleName='icon'><IPFSImage fallback={TOKEN_ICONS[type.symbol]} /></div>
                <div styleName='title'>
                  <Translate value={type.title} />
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
