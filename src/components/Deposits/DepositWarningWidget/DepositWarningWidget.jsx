/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { TOKEN_ICONS } from 'assets'
import { Button, IPFSImage } from 'components'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { TIME } from '@chronobank/core/redux/mainWallet/actions'
import { DUCK_ASSETS_HOLDER } from '@chronobank/core/redux/assetsHolder/actions'
import AllowanceModel from '@chronobank/core/models/wallet/AllowanceModel'
import { getDeposit } from '@chronobank/core/redux/mainWallet/selectors'
import { modalsOpen } from 'redux/modals/actions'
import DepositTokensModal from 'components/dashboard/DepositTokens/DepositTokensModal'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import { getMainEthWallet } from '@chronobank/core/redux/wallets/selectors/models'
import PropTypes from 'prop-types'
import './DepositWarningWidget.scss'
import { prefix } from './lang'

function mapStateToProps (state) {
  // state
  const wallet: WalletModel = getMainEthWallet(state)
  const assetHolder = state.get(DUCK_ASSETS_HOLDER)

  const spender = assetHolder.wallet()
  return {
    deposit: getDeposit(TIME)(state),
    allowance: wallet.allowances.list[`${spender}-${TIME}`] || new AllowanceModel(),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleContinueDeposit: () => dispatch(modalsOpen({ component: DepositTokensModal })),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class DepositWarningWidget extends PureComponent {
  static propTypes = {
    handleContinueDeposit: PropTypes.func,
    allowance: PropTypes.instanceOf(AllowanceModel),
  }

  render () {
    if (this.props.allowance.amount().lte(0)) {
      return null
    }
    return (
      <div styleName='header-container'>
        <div styleName='wallet-list-container'>

          <div styleName='wallet-container'>
            <div styleName='token-container'>
              <div styleName='token-icon'>
                <IPFSImage styleName='imageIcon' fallback={TOKEN_ICONS.TIME} />
              </div>
            </div>
            <div styleName='content-container'>
              <div styleName='title'><Translate value={`${prefix}.title`} /></div>
              <div styleName='text'><Translate value={`${prefix}.message`} /></div>
              <div styleName='steps'>
                <div styleName='step'>
                  {this.props.allowance.amount().gt(0) ? (
                    <div styleName='icon-success' className='chronobank-icon'>check-circle</div>
                  ) : (
                    <div styleName='icon'>1</div>
                  )}
                  <div styleName='title'><Translate value={`${prefix}.step1`} /></div>
                </div>
                <div styleName='step'>
                  <div styleName='icon'>2</div>
                  <div styleName='title'><Translate value={`${prefix}.step2`} /></div>
                </div>
              </div>
              <div styleName='actions-container'>
                <div styleName='action'>
                  <Button
                    disabled={false}
                    type='submit'
                    label={<Translate value={`${prefix}.button`} />}
                    onClick={this.props.handleContinueDeposit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
