import React from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FlatButton, Paper } from 'material-ui'
import WalletSelectDialog from 'components/dialogs/wallet/WalletSelectDialog'
import WalletAddEditDialog from 'components/dialogs/wallet/WalletAddEditDialog/WalletAddEditDialog'
import { modalsOpen } from 'redux/modals/actions'
import * as actions from 'redux/multisigWallet/actions'
import classNames from 'classnames'
import WalletMainSVG from 'assets/img/icn-wallet-main.svg'
import WalletMainBigSVG from 'assets/img/icn-wallet-main-big.svg'
import WalletMultiSVG from 'assets/img/icn-wallet-multi.svg'
import WalletMultiBigSVG from 'assets/img/icn-wallet-multi-big.svg'
import globalStyles from 'layouts/partials/styles'
import MultisigWalletModel from 'models/Wallet/MultisigWalletModel'
import Preloader from 'components/common/Preloader/Preloader'
import { getCurrentWallet, switchWallet } from 'redux/wallet/actions'
import './WalletChanger.scss'

function mapStateToProps (state) {
  return {
    isMultisig: getCurrentWallet(state).isMultisig(),
    account: state.get('session').account,
    multisigWallet: state.get('multisigWallet')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    walletSelectDialog: () => dispatch(modalsOpen({
      component: WalletSelectDialog
    })),
    walletAddEditDialog: () => dispatch(modalsOpen({
      component: WalletAddEditDialog,
      props: {wallet: new MultisigWalletModel()}
    })),
    getWallets: () => dispatch(actions.getWallets()),
    switchWallet: (wallet) => dispatch(switchWallet(wallet))
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletChanger extends React.Component {
  static propTypes = {
    isMultisig: PropTypes.bool,
    multisigWallet: PropTypes.object,
    walletSelectDialog: PropTypes.func,
    walletAddEditDialog: PropTypes.func,
    getWallets: PropTypes.func,
    switchWallet: PropTypes.func,
    account: PropTypes.string,
  }

  componentWillMount () {
    if (!this.props.multisigWallet.isFetched() || !this.props.multisigWallet.isFetching()) {
      this.props.getWallets()
    }
  }

  handleCreateWallet () {
    this.props.walletAddEditDialog()
  }

  renderMainWallet () {
    const {isMultisig, account, multisigWallet} = this.props
    return (
      <div styleName={classNames('walletBox', {'isMultisig': isMultisig})}>
        <Paper style={globalStyles.content.paper.style}>
          <div styleName='header'>
            <img styleName='headerIcon' src={WalletMainBigSVG} />
            <div styleName='headerInfo'>
              <div styleName='headerTitle'><Translate value='wallet.mainWallet' /></div>
              <div styleName='headerSubtitle'>{account}</div>
            </div>
          </div>

          <div styleName='body'>
            <div styleName='actions'>
              <div styleName='action' />
              <div styleName='action'>
                <FlatButton
                  label={multisigWallet.isFetching()
                    ? <Preloader />
                    : (
                      <span styleName='buttonLabel'>
                        <img styleName='buttonIcon' src={WalletMultiSVG} />
                        <Translate value={multisigWallet.list().size > 0 ? 'wallet.switchToMultisignatureWallet' : 'wallet.createMultisignatureWallet'} />
                      </span>
                    )}
                  onTouchTap={multisigWallet.list().size > 0
                    ? () => this.props.switchWallet(multisigWallet.selected())
                    : () => this.handleCreateWallet()}
                  disabled={multisigWallet.isFetching()}
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
    const {multisigWallet} = this.props
    const selectedWallet: MultisigWalletModel = multisigWallet.selected()
    const owners = selectedWallet.owners()

    return (
      <div styleName='walletBox'>
        <Paper style={globalStyles.content.paper.style}>
          <div styleName='header'>
            <img styleName='headerIcon' src={WalletMultiBigSVG} />
            <div styleName='headerInfo'>
              <div styleName='headerTitle'>{selectedWallet.name() || 'No name'}</div>
              <div styleName='headerSubtitle'>Multisignature wallet</div>
              <div styleName='headerSubtitle'>{selectedWallet.address()}</div>
              <div>
                <div styleName='ownersNum'>
                  {owners.size + 1} <Translate value='wallet.owners' />:
                </div>
                <div styleName='owners'>
                  <div key='account' styleName='iconHolder'>
                    <i className='material-icons'>account_circle</i>
                  </div>
                  {owners.map((owner, idx) => (
                    <div key={idx} styleName='iconHolder'>
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
              <span styleName='walletsCount'>{multisigWallet.list().size}</span>
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
                  onTouchTap={() => this.props.switchWallet(false)}
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
                  onTouchTap={() => this.props.walletSelectDialog()}
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
      <div styleName={classNames('root', {'isMultisig': this.props.isMultisig})}>
        {this.renderMainWallet()}
        {this.props.multisigWallet.hasSelected() && this.renderMultisigWallet()}
      </div>
    )
  }
}
