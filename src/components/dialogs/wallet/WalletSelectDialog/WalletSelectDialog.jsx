import WalletMultiBigSVG from 'assets/img/icn-wallet-multi-big.svg'
import classNames from 'classnames'
import WithLoader, { isPending } from 'components/common/Preloader/WithLoader'
import EditManagersDialog from 'components/dialogs/wallet/EditOwnersDialog/EditOwnersDialog'
import WalletsItem from 'components/dialogs/wallet/WalletSelectDialog/WalletsItem'
import { FloatingActionButton, FontIcon } from 'material-ui'
import MultisigWalletCollection from 'models/wallet/MultisigWalletCollection'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { modalsClose, modalsOpen } from 'redux/modals/actions'
import { addOwner, DUCK_MULTISIG_WALLET, multisigTransfer, removeWallet } from 'redux/multisigWallet/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { switchWallet } from 'redux/wallet/actions'
import ModalDialog from '../../ModalDialog'
import WalletAddEditDialog from '../WalletAddDialog/WalletAddDialog'
import { prefix } from './lang'
import './WalletSelectDialog.scss'

function mapStateToProps (state) {
  const msWallets: MultisigWalletCollection = state.get(DUCK_MULTISIG_WALLET)

  return {
    multisigWallets: msWallets.activeWallets(),
    timeLockedWallets: msWallets.timeLockedWallets(),
    account: state.get(DUCK_SESSION).account,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    openAddWalletDialog: () => dispatch(modalsOpen({
      component: WalletAddEditDialog,
      props: { wallet: new MultisigWalletModel() },
    })),
    openEditManagersDialog: (wallet) => dispatch(modalsOpen({
      component: EditManagersDialog,
      props: { wallet },
    })),
    modalsClose: () => dispatch(modalsClose()),
    selectWallet: (wallet) => dispatch(switchWallet(wallet)),
    removeWallet: (wallet) => dispatch(removeWallet(wallet)),
    addOwner: (wallet) => dispatch(addOwner(wallet)),
    transfer: (wallet) => dispatch(multisigTransfer(wallet)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletSelectDialog extends Component {
  static propTypes = {
    multisigWallets: PropTypes.arrayOf(MultisigWalletModel),
    timeLockedWallets: PropTypes.arrayOf(MultisigWalletModel),
    modalsClose: PropTypes.func,
    openEditManagersDialog: PropTypes.func,
    openAddWalletDialog: PropTypes.func,
    removeWallet: PropTypes.func,
    transfer: PropTypes.func,
    addOwner: PropTypes.func,
    selectWallet: PropTypes.func,
  }

  renderRow = (wallet: MultisigWalletModel) => {
    const isSelected = wallet.isSelected()
    const owners = wallet.owners()

    return (
      <div key={wallet.id()} styleName={classNames('row', { selected: isSelected })}>
        <div onTouchTap={() => !isSelected && this.selectMultisigWallet(wallet)}>
          <div>
            <img src={WalletMultiBigSVG} />
          </div>
        </div>
        <div onTouchTap={() => !isSelected && this.selectMultisigWallet(wallet)}>
          <div>{wallet.isPending() ? 'Pending...' : wallet.address()}</div>
          <div>
            <div>
              <div>
                <Translate value={`${prefix}.numOwners`} num={owners.size()} />
              </div>
              <div>
                {owners.items().map((owner, idx) => (
                  <i
                    className='material-icons'
                    key={owner}
                    title={owner}
                  >account_circle
                  </i>
                ))}
              </div>
            </div>
            <div>
              <div>
                <Translate value={`${prefix}.pendings`} />
              </div>
              <div>{wallet.pendingCount()}</div>
            </div>
          </div>
        </div>
        <div>
          <WithLoader showLoader={isPending} payload={wallet}>
            {this.renderWalletActions}
          </WithLoader>
        </div>
      </div>
    )
  }

  handleAddWallet = () => this.props.openAddWalletDialog()

  handleRemove = (wallet) => this.props.removeWallet(wallet)

  handleEditOwners = (wallet) => this.props.openEditManagersDialog(wallet)

  handleSelect = (wallet) => {
    this.props.modalsClose()
    this.props.selectWallet(wallet)
  }

  renderBlock (title, wallets: Array) {

    return (
      <div styleName='block'>
        <div styleName='blockTitle'><Translate value={`${prefix}.${title}`} /></div>
        <div styleName='blockList'>
          {wallets.length > 0
            ? wallets.map((wallet) => (
              <WalletsItem
                key={wallet.id()}
                wallet={wallet}
                onRemove={this.handleRemove}
                onEditOwners={this.handleEditOwners}
                onSelect={this.handleSelect}
              />
            ))
            : <div styleName='noWallets'><Translate value={`${prefix}.noWallets`} /></div>
          }
        </div>
      </div>
    )
  }

  render () {
    const { multisigWallets, timeLockedWallets } = this.props

    return (
      <ModalDialog>
        <div styleName='root'>
          <div styleName='header'>
            <div styleName='headerTitle'><Translate value={`${prefix}.headerTitle`} /></div>
            <div styleName='headerSubtitle'><Translate value={`${prefix}.headerSubtitle`} /></div>
            <div styleName='headerFAB'>
              <FloatingActionButton onTouchTap={this.handleAddWallet}>
                <FontIcon className='material-icons'>add</FontIcon>
              </FloatingActionButton>
            </div>
          </div>
          <div styleName='body'>
            {this.renderBlock('activeWallets', multisigWallets)}
            {this.renderBlock('timeLockedWallets', timeLockedWallets)}

            {/*<Translate value={`${prefix}.${wallets.length > 0 ? 'yourWallets' : 'youHaveNoWallets'}`} />*/}
            {/*{wallets.map(this.renderRow)}*/}

          </div>
        </div>
      </ModalDialog>
    )
  }
}
