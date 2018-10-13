/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { TOKEN_ICONS } from 'assets'
import Button from 'components/common/ui/Button/Button'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { ETH, TIME } from '@chronobank/core/dao/constants'
import { getDeposit } from '@chronobank/core/redux/assetsHolder/selectors'
import { modalsOpen } from '@chronobank/core/redux/modals/actions'
import { getMainEthWallet } from '@chronobank/core/redux/wallets/selectors/models'
import { integerWithDelimiter } from '@chronobank/core/utils/formatter'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import PropTypes from 'prop-types'
import LABOR_X_LOGO_SVG from 'assets/img/laborx-icon.svg'
import './LaborXConnectWidget.scss'
import { prefix } from './lang'

function mapStateToProps (state) {
  const wallet = getMainEthWallet(state)
  return {
    deposit: getDeposit(TIME)(state),
    wallet,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onOpenReceiveForm: (wallet) => dispatch(modalsOpen({
      componentName: 'ReceiveTokenModal',
      props: {
        wallet,
        tokenId: ETH,
      },
    })),
    handleOpenDepositForm: () => dispatch(modalsOpen({ componentName: 'DepositTokensModal' })),
    handleOpenUnlockForm: () => dispatch(modalsOpen({ componentName: 'UnlockLaborXModal' })),
    handleOpenLockForm: () => dispatch(modalsOpen({ componentName: 'LaborXConnectModal' })),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class LaborXConnectWidget extends PureComponent {
  static propTypes = {
    onOpenReceiveForm: PropTypes.func,
    handleOpenDepositForm: PropTypes.func,
    handleOpenLockForm: PropTypes.func,
    handleOpenUnlockForm: PropTypes.func,
    wallet: PropTypes.instanceOf(WalletModel),
  }

  handleOpenReceiveForm = () => {
    this.props.onOpenReceiveForm(this.props.wallet)
  }

  render () {
    return (
      <div styleName='header-container'>
        <div styleName='wallet-list-container'>
          <div styleName='wallet-container'>
            <div styleName='token-container'>
              <div styleName='token-icon'>
                <IPFSImage styleName='imageIcon' fallback={LABOR_X_LOGO_SVG} />
              </div>
            </div>
            <div styleName='content-container'>
              <div styleName='title'><Translate value={`${prefix}.title`} /></div>
              <div styleName='text'><Translate value={`${prefix}.message`} /></div>
              <div styleName='steps'>
                <div styleName='step'>
                  <div styleName='icon'>1</div>
                  <div styleName='title'><Translate value={`${prefix}.step1`} /></div>
                </div>
                <div styleName='step'>
                  <div styleName='icon'>2</div>
                  <div styleName='title'><Translate value={`${prefix}.step2`} /></div>
                </div>
                <div styleName='step'>
                  <div styleName='icon'>3</div>
                  <div styleName='title'><Translate value={`${prefix}.step3`} /></div>
                </div>
              </div>
              <div styleName='tokensList'>
                <div styleName='token'>
                  <div styleName='icon'><IPFSImage styleName='imageIcon' fallback={TOKEN_ICONS.TIME} /></div>
                  <div styleName='title'>{TIME}&nbsp;{integerWithDelimiter('10.00', true)}</div>
                </div>
              </div>
              <div styleName='actions-container'>
                <div styleName='action'>
                  <Button
                    type='submit'
                    label={<Translate value={`${prefix}.getStarted`} />}
                    onClick={this.handleOpenReceiveForm}
                  />
                  <Button
                    disabled={false}
                    type='submit'
                    label={<Translate value={`${prefix}.continue`} />}
                    onClick={this.props.handleOpenDepositForm}
                  />
                  <Button
                    disabled={false}
                    type='submit'
                    label={<Translate value={`${prefix}.unlock`} />}
                    onClick={this.props.handleOpenUnlockForm}
                  />
                  <Button
                    disabled={false}
                    type='submit'
                    label={<Translate value={`${prefix}.lock`} />}
                    onClick={this.props.handleOpenLockForm}
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
