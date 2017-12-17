import WalletMainBigSVG from 'assets/img/icn-wallet-main-big.svg'
import WalletMainSVG from 'assets/img/icn-wallet-main.svg'
import WalletMultiBigSVG from 'assets/img/icn-wallet-multi-big.svg'
import WalletMultiSVG from 'assets/img/icn-wallet-multi.svg'
import classNames from 'classnames'
import Preloader from 'components/common/Preloader/Preloader'
import WalletAddEditDialog from 'components/dialogs/wallet/WalletAddEditDialog/WalletAddEditDialog'
import WalletSelectDialog from 'components/dialogs/wallet/WalletSelectDialog'
import globalStyles from 'layouts/partials/styles'
import { FlatButton, Paper } from 'material-ui'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DUCK_MAIN_WALLET } from 'redux/mainWallet/actions'
import { modalsOpen } from 'redux/modals/actions'
import { DUCK_MULTISIG_WALLET } from 'redux/multisigWallet/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { getCurrentWallet, switchWallet } from 'redux/wallet/actions'

import './WalletChanger.scss'

function mapStateToProps (state) {
  return {
    isMultisig: getCurrentWallet(state).isMultisig(),
    account: state.get(DUCK_SESSION).account,
    mainWallet: state.get(DUCK_MAIN_WALLET),
    multisigWallet: state.get(DUCK_MULTISIG_WALLET),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    walletSelectDialog: () => dispatch(modalsOpen({
      component: WalletSelectDialog,
    })),
    walletAddEditDialog: () => dispatch(modalsOpen({
      component: WalletAddEditDialog,
      props: { wallet: new MultisigWalletModel() },
    })),
    switchWallet: (wallet) => dispatch(switchWallet(wallet)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletChanger extends PureComponent {
  static propTypes = {
    isMultisig: PropTypes.bool,
    mainWallet: PropTypes.object,
    multisigWallet: PropTypes.object,
    walletSelectDialog: PropTypes.func,
    walletAddEditDialog: PropTypes.func,
    switchWallet: PropTypes.func,
    account: PropTypes.string,
  }

  handleShowSelectDialog = () => this.props.walletSelectDialog()

  handleSwitchWallet = () => this.props.switchWallet(this.props.mainWallet)

  renderMainWallet () {
    const { isMultisig, mainWallet, multisigWallet } = this.props

    return (
      <div styleName={classNames('walletBox', { 'isMultisig': isMultisig })}>
        <Paper>
          <div styleName='header'>
            <img styleName='headerIcon' src={WalletMainBigSVG} />
            <div styleName='headerInfo'>
              <div styleName='headerTitle'><Translate value='wallet.mainWallet' /></div>
              <div styleName='headerSubtitle'>{mainWallet.address()}</div>
            </div>
          </div>

          <div styleName='body'>
            <div styleName='actions'>
              <div styleName='action' />
              <div styleName='action'>
                <FlatButton
                  label={!multisigWallet.isFetching() && !multisigWallet.isFetched()
                    ? <Preloader />
                    : (
                      <span styleName='buttonLabel'>
                        {multisigWallet.isFetching() && (
                          <div styleName='buttonPreloader'>
                            <Preloader small />
                            <div
                              styleName='buttonCounter'>
                              {`[${multisigWallet.size()}/${multisigWallet.size() + multisigWallet.leftToFetch()}]`}
                            </div>
                          </div>)}
                        <img styleName='buttonIcon' src={WalletMultiSVG} />
                        {multisigWallet.size() > 0
                          ? (
                            <span>
                              <Translate value='wallet.switchToMultisignatureWallet' />
                              {multisigWallet.allPendingsCount() > 0 && <span styleName='pendingCounter'>{multisigWallet.allPendingsCount()}</span>}
                            </span>
                          )
                          : <Translate value='wallet.createMultisignatureWallet' />
                        }
                      </span>
                    )}
                  onTouchTap={multisigWallet.size() > 0
                    ? () => this.props.switchWallet(multisigWallet.selected())
                    : () => this.props.walletAddEditDialog()}
                  {...globalStyles.buttonWithIconStyles}
                />
              </div>
            </div>
          </div>
        </Paper>
      </div>
    )
  }

  renderMultisigWallet () {
    const { multisigWallet } = this.props
    const selectedWallet: MultisigWalletModel = multisigWallet.selected()
    const owners = selectedWallet.owners()

    return (
      <div styleName='walletBox'>
        <Paper>
          <div styleName='header'>
            <img styleName='headerIcon' src={WalletMultiBigSVG} />
            <div styleName='headerInfo'>
              <div styleName='headerSubtitle'>Multisignature wallet</div>
              <div styleName='headerSubtitle'>{selectedWallet.isPending() ? 'Pending...' : selectedWallet.address()}</div>
              <div>
                <div styleName='ownersNum'>
                  {owners.size} <Translate value='wallet.owners' />:
                </div>
                <div styleName='owners'>
                  {owners.map((owner, idx) => (
                    <div
                      key={idx}
                      styleName='iconHolder'
                      title={owner}
                    >
                      <i className='material-icons'>account_circle</i>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div styleName='body'>
            <div><Translate value='wallet.youHave' />:</div>
            <div>
              <span styleName='walletsCount'>{multisigWallet.size()}</span>
              <span styleName='walletsCountType'><Translate value='wallet.multisignatureWallets' /></span>
            </div>

            <div styleName='actions'>
              <div styleName='action'>
                <FlatButton
                  label={(
                    <span styleName='buttonLabel'>
                      <img styleName='buttonIcon' src={WalletMainSVG} />
                      <Translate value='wallet.switchToMainWallet' />
                    </span>
                  )}
                  onTouchTap={this.handleSwitchWallet}
                  {...globalStyles.buttonWithIconStyles}
                />
              </div>
              <div styleName='action'>
                <FlatButton
                  label={(
                    <span styleName='buttonLabel'>
                      <img styleName='buttonIcon' src={WalletMultiSVG} />
                      <Translate value='wallet.changeMultisignatureWallet' />
                    </span>
                  )}
                  onTouchTap={this.handleShowSelectDialog}
                  {...globalStyles.buttonWithIconStyles}
                />
              </div>
            </div>
          </div>
        </Paper>
      </div>
    )
  }

  render () {
    return (
      <div styleName={classNames('root', { 'isMultisig': this.props.isMultisig })}>
        {this.renderMainWallet()}
        {this.props.multisigWallet.hasSelected() && this.renderMultisigWallet()}
      </div>
    )
  }
}
