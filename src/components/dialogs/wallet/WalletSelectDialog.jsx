import WalletDialogSVG from 'assets/img/icn-wallet-dialog.svg'
import WalletMultiBigSVG from 'assets/img/icn-wallet-multi-big.svg'
import classNames from 'classnames'
import Points from 'components/common/Points/Points'
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
import ModalDialog from '../ModalDialog'
import WalletAddEditDialog from './WalletAddEditDialog/WalletAddEditDialog'

import './WalletSelectDialog.scss'

function mapStateToProps (state) {
  return {
    multisigWallet: state.get(DUCK_MULTISIG_WALLET),
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

  renderRow = (wallet: MultisigWalletModel) => {
    const isSelected = wallet.isSelected()
    const owners = wallet.owners()

    return (
      <div key={wallet.id()} styleName={classNames('row', { selected: isSelected })}>
        <div styleName='cell' onTouchTap={() => !isSelected && this.selectMultisigWallet(wallet)}>
          <div>
            <img styleName='bigIcon' src={WalletMultiBigSVG} />
          </div>
        </div>
        <div styleName='cell cellAuto' onTouchTap={() => !isSelected && this.selectMultisigWallet(wallet)}>
          <div styleName='address'>{wallet.isPending() ? 'Pending...' : wallet.address()}</div>
          <div styleName='details'>
            <div styleName='owners'>
              <div styleName='ownersCount'>
                <Translate num={owners.size()} value='wallet.walletSelectDialog.owners' />
              </div>
              <div>
                {owners.items().map((owner, idx) => (
                  <i
                    className='material-icons'
                    key={owner}
                    title={owner}
                    styleName={owners.size() > 4 && idx ? 'faces tight' : 'faces'}
                  >account_circle
                  </i>
                ))}
              </div>
            </div>
            <div styleName='pendings'>
              <div styleName='pendingsTitle'>
                <Translate value='wallet.walletSelectDialog.pendings' />
              </div>
              <div styleName={classNames('pendingsCount', { disabled: wallet.pendingCount() === 0 })}>{wallet.pendingCount()}</div>
            </div>
          </div>
        </div>
        <div styleName='cell control'>
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
        styleName='controlItem'
        onTouchTap={() => this.handleEditManagers(wallet)}
      >
        edit
      </i>
      <i
        className='material-icons'
        styleName='controlItem'
        onTouchTap={() => this.props.removeWallet(wallet)}
      >
        delete
      </i>
    </div>
  )

  render () {
    const wallets: Array = this.props.multisigWallet.items()

    return (
      <ModalDialog>
        <div styleName='content'>
          <div styleName='header'>
            <h3 styleName='headerTitle'><Translate value='wallet.walletSelectDialog.multisignatureWallets' /></h3>
            <div styleName='subtitle'><Translate value='wallet.walletSelectDialog.addWallet' /></div>
            <img styleName='headerBigIcon' src={WalletDialogSVG} />
          </div>
          <div styleName='actions'>
            <div styleName='actionsItems'>
              <div styleName='actionsItem'>
                <FloatingActionButton onTouchTap={() => this.props.walletAddEditDialog()}>
                  <FontIcon className='material-icons'>add</FontIcon>
                </FloatingActionButton>
              </div>
            </div>
          </div>
          <div styleName='body'>
            <div styleName='column'>
              <h5 styleName='colName'>
                <Translate value={'wallet.walletSelectDialog.' + (wallets.length > 0 ? 'yourWallets' : 'youHaveNoWallets')} />
              </h5>
              <div styleName='table'>
                {wallets.map(this.renderRow)}
              </div>
            </div>
            <div styleName='column'>
              <h5 styleName='colName'><Translate value='wallet.walletSelectDialog.howToAddMultisignatureWallet' />
              </h5>
              <div styleName='description'>
                <p><Translate value='wallet.walletSelectDialog.toCreateAMultisigWallet' /></p>
              </div>
              <Points>
                <Translate value='wallet.walletSelectDialog.clickPlusButtonAtTheTop' />
                <Translate value='wallet.walletSelectDialog.selectOwnersAtLeastTwo' />
                <Translate value='wallet.walletSelectDialog.selectRequiredNumberOfSignaturesFromOwners' />
              </Points>
            </div>
          </div>
        </div>
      </ModalDialog>
    )
  }
}
