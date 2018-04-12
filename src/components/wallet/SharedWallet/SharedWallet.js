/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import TokenModel from 'models/tokens/TokenModel'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { TOKEN_ICONS } from 'assets'
import Button from '../../common/ui/Button/Button'
import IPFSImage from '../../common/IPFSImage/IPFSImage'

import './SharedWallet.scss'

function mapStateToProps (state, props) {

  return {

  }
}

function mapDispatchToProps (dispatch, props) {
  return {

  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SharedWallet extends PureComponent {
  static propTypes = {
    token: PropTypes.instanceOf(TokenModel),
  }


  render () {
    const { token } = this.props
    console.log('SharedWallet: ', this.props)


    return (

      <div styleName='wallet-container'>
        <div styleName='settings-container'>
          <div styleName='settings-icon' className='chronobank-icon'>settings</div>
        </div>
        <div styleName='token-container'>
          <div styleName='additional-icon'>
            <div styleName='security-icon' className='chronobank-icon'>people</div>
          </div>
          <div styleName='token-icon'>
            <div styleName='image' className='chronobank-icon'>wallet</div>
          </div>
        </div>
        <div styleName='content-container'>
          <div styleName='address-title'>
            <h3>My Shared Wallet</h3>
            <span styleName='address-address'>
              1Q1pE5vPGEEMqRcVRMbtBK842Y6Pzo6nK9
            </span>
          </div>
          <div styleName='token-amount'>
            <div styleName='crypto-amount'>
              USD 121,600.00
            </div>
          </div>
          <div styleName='owners-amount'>
            <div styleName='owners-list'>
              <div styleName='owner-icon'>
                <div styleName='owner' className='chronobank-icon'>profile</div>
              </div>
              <div styleName='owner-icon'>
                <div styleName='owner' className='chronobank-icon'>profile</div>
              </div>
              <div styleName='owner-counter'>
                <div styleName='counter'>+3</div>
              </div>
            </div>
            <div styleName='pending-transactions'>
              <span styleName='transaction-text'>
                2 Pending transactions
              </span>
            </div>
          </div>
          <div styleName='amount-list-container'>
            <div styleName='amount-list'>
              <span styleName='amount-text'>
                ETH 21.00, TIME 521.20
              </span>
            </div>
            <div styleName='show-all'>
              <a styleName='show-all-a' href='javascript:void(0)'>Show All</a>
            </div>
          </div>
          <div styleName='tokens-list'>
            <div styleName='tokens-list-table'>
              <div styleName='tokens-list-table-tr'>
                <div styleName='tokens-list-table-cell-icon'>
                  <IPFSImage styleName='table-image' multihash={token.icon()} fallback={TOKEN_ICONS[token.symbol()]} />
                </div>
                <div styleName='tokens-list-table-cell-amount'>
                  ETH 10.00
                </div>
                <div styleName='tokens-list-table-cell-usd'>
                  USD 10,000.00
                </div>
              </div>
              <div styleName='tokens-list-table-tr'>
                <div styleName='tokens-list-table-cell-icon'>
                  <IPFSImage styleName='table-image' multihash={token.icon()} fallback={TOKEN_ICONS[token.symbol()]} />
                </div>
                <div styleName='tokens-list-table-cell-amount'>
                  ETH 10.00
                </div>
                <div styleName='tokens-list-table-cell-usd'>
                  USD 10,000.00
                </div>
              </div>
            </div>
          </div>
          <div styleName='actions-container'>
            <div styleName='action'>
              <Button
                disabled={false}
                type='submit'
                label={'SEND'}
              />
            </div>
            <div styleName='action'>
              <Button
                disabled={false}
                type='submit'
                label={'RECEIVE'}
              />
            </div>
            <div styleName='action'>
              <Button
                disabled={false}
                flat
                type='submit'
                label={'DEPOSIT'}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
