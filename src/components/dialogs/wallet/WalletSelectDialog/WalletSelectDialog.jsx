import WalletsItem from '@/components/dialogs/wallet/WalletSelectDialog/WalletsItem'
import WalletDialogSVG from 'assets/img/icn-wallet-dialog.svg'
import WalletMultiBigSVG from 'assets/img/icn-wallet-multi-big.svg'
import classNames from 'classnames'
import WithLoader, { isPending } from 'components/common/Preloader/WithLoader'
import EditManagersDialog from 'components/dialogs/wallet/EditOwnersDialog/EditOwnersDialog'
import { FloatingActionButton, FontIcon } from 'material-ui'
import MultisigWalletCollection from 'models/wallet/MultisigWalletCollection'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { modalsClose, modalsOpen } from 'redux/modals/actions'
import { addOwner, DUCK_MULTISIG_WALLET, multisigTransfer, removeWallet } from 'redux/multisigWallet/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { switchWallet } from 'redux/wallet/actions'
import ModalDialog from '../../ModalDialog'
import WalletAddEditDialog from '../WalletAddEditDialog/WalletAddEditDialog'
import { prefix } from './lang'
import './WalletSelectDialog.scss'

// TODO @dkchv: implement filter
const stubTimeLockedWallets = new MultisigWalletCollection()

function mapStateToProps (state) {
  return {
    multisigWallet: state.get(DUCK_MULTISIG_WALLET),
    timeLockedWallets: stubTimeLockedWallets,
    account: state.get(DUCK_SESSION).account,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    walletAddEditDialog: () => dispatch(modalsOpen({
      component: WalletAddEditDialog,
      props: { wallet: new MultisigWalletModel() },
    })),
    handleEditManagersDialog: (wallet) => dispatch(modalsOpen({
      component: EditManagersDialog,
      props: { wallet },
    })),
    modalsClose: () => dispatch(modalsClose()),
    switchWallet: (wallet) => dispatch(switchWallet(wallet)),
    removeWallet: (wallet) => dispatch(removeWallet(wallet)),
    addOwner: (wallet) => dispatch(addOwner(wallet)),
    transfer: (wallet) => dispatch(multisigTransfer(wallet)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletSelectDialog extends PureComponent {
  static propTypes = {
    multisigWallet: PropTypes.instanceOf(MultisigWalletCollection),
    timeLockedWallets: PropTypes.instanceOf(MultisigWalletCollection),
    modalsClose: PropTypes.func,
    handleEditManagersDialog: PropTypes.func,
    walletAddEditDialog: PropTypes.func,
    removeWallet: PropTypes.func,
    transfer: PropTypes.func,
    addOwner: PropTypes.func,
    switchWallet: PropTypes.func,
  }

  handleEditManagers (wallet: MultisigWalletModel) {
    this.props.handleEditManagersDialog(wallet)
  }

  selectMultisigWallet (wallet) {
    this.props.modalsClose()
    this.props.switchWallet(wallet)
  }

  handleAddWallet = () => this.props.walletAddEditDialog()

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
                <Translate value={`${prefix}.owners`} num={owners.size()} />
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

  renderWalletActions = ({ payload: wallet }) => (
    <div>
      <i
        className='material-icons'
        onTouchTap={() => this.handleEditManagers(wallet)}
      >
        edit
      </i>
      <i
        className='material-icons'
        onTouchTap={() => this.props.removeWallet(wallet)}
      >
        delete
      </i>
    </div>
  )

  handleRemove = (wallet) => this.props.removeWallet(wallet)

  handleEdit = (wallet) => this.props.handleEditManagersDialog(wallet)

  renderBlock (title, wallets: MultisigWalletCollection) {
    return (
      <div styleName='block'>
        <div styleName='blockTitle'><Translate value={`${prefix}.${title}`} /></div>
        <div styleName='blockList'>
          {wallets.size() > 0
            ? wallets.items().map((wallet) => (
              <WalletsItem
                wallet={wallet}
                onRemove={this.handleRemove}
                onEdit={this.handleEdit}
              />
            ))
            : <div styleName='noWallets'><Translate value={`${prefix}.noWallets`} /></div>
          }
        </div>
      </div>
    )
  }

  render () {
    const { multisigWallet, timeLockedWallets } = this.props

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
            {this.renderBlock('activeWallets', multisigWallet)}
            {this.renderBlock('timeLockedWallets', timeLockedWallets)}

            {/*<Translate value={`${prefix}.${wallets.length > 0 ? 'yourWallets' : 'youHaveNoWallets'}`} />*/}
            {/*{wallets.map(this.renderRow)}*/}

          </div>
        </div>
      </ModalDialog>
    )
  }
}
