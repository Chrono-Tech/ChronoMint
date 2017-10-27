import React from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { CSSTransitionGroup } from 'react-transition-group'
import { FloatingActionButton, FontIcon } from 'material-ui'
import Points from 'components/common/Points/Points'
import Preloader from 'components/common/Preloader/Preloader'
import { modalsOpen, modalsClose } from 'redux/modals/actions'
import WalletMultiBigSVG from 'assets/img/icn-wallet-multi-big.svg'
import WalletDialogSVG from 'assets/img/icn-wallet-dialog.svg'
import { addOwner, removeWallet, multisigTransfer, DUCK_MULTISIG_WALLET } from 'redux/multisigWallet/actions'
import MultisigWalletModel from 'models/Wallet/MultisigWalletModel'
import { switchWallet } from 'redux/wallet/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import './WalletSelectDialog.scss'
import ModalDialog from '../ModalDialog'
import WalletAddEditDialog from './WalletAddEditDialog/WalletAddEditDialog'

const TRANSITION_TIMEOUT = 250

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
      props: {wallet: new MultisigWalletModel()},
    })),
    handleClose: () => dispatch(modalsClose()),
    switchWallet: wallet => dispatch(switchWallet(wallet)),
    removeWallet: wallet => dispatch(removeWallet(wallet)),
    addOwner: wallet => dispatch(addOwner(wallet)),
    transfer: wallet => dispatch(multisigTransfer(wallet)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletSelectDialog extends React.Component {
  static propTypes = {
    multisigWallet: PropTypes.object,
    handleClose: PropTypes.func,
    walletAddEditDialog: PropTypes.func,
    removeWallet: PropTypes.func,
    transfer: PropTypes.func,
    addOwner: PropTypes.func,
    switchWallet: PropTypes.func,
  }

  selectMultisigWallet (wallet) {
    this.props.handleClose()
    this.props.switchWallet(wallet)
  }

  render () {
    const wallets = this.props.multisigWallet.list()
    const selected = this.props.multisigWallet.selected().address()

    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={TRANSITION_TIMEOUT}
        transitionEnterTimeout={TRANSITION_TIMEOUT}
        transitionLeaveTimeout={TRANSITION_TIMEOUT}
      >
        <ModalDialog onClose={() => this.props.handleClose()}>
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
                <h5 styleName='colName'><Translate
                  value={'wallet.walletSelectDialog.' + (wallets.size ? 'yourWallets' : 'youHaveNoWallets')} />
                </h5>
                <div styleName='table'>
                  {wallets.map(item => this.renderRow(item, selected === item.address))}
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
      </CSSTransitionGroup>
    )
  }

  renderRow (wallet: MultisigWalletModel, isSelected: boolean) {
    return (
      <div key={wallet.id()} styleName={classNames('row', {'rowSelected': isSelected})}>
        <div styleName='cell' onTouchTap={() => !isSelected && this.selectMultisigWallet(wallet)}>
          <div>
            <img styleName='bigIcon' src={WalletMultiBigSVG} />
          </div>
        </div>
        <div styleName='cell cellAuto' onTouchTap={() => !isSelected && this.selectMultisigWallet(wallet)}>
          <div styleName='symbol'>{wallet.name()}</div>
          <div>
            <span styleName='ownersNum'>
              {wallet.owners().size} <Translate value='wallet.walletSelectDialog.owners' />
            </span>
            <div>
              {wallet.owners().map((owner, idx) => <i
                className='material-icons'
                key={owner}
                title={owner}
                styleName={wallet.owners().size > 4 && idx ? 'faces tight' : 'faces'}
              >account_circle</i>)}
            </div>
          </div>
        </div>
        <div styleName='cell control'>
          {wallet.isPending()
            ? <Preloader />
            : <div>
              <i
                className='material-icons'
                styleName='controlItem'
                onTouchTap={() => {this.props.walletAddEditDialog()}}>
                edit
              </i>
              <i
                className='material-icons'
                styleName='controlItem'
                onTouchTap={() => this.props.removeWallet(wallet)}>
                delete
              </i>
            </div>
          }
        </div>
      </div>
    )
  }
}
