import React from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { CSSTransitionGroup } from 'react-transition-group'
import { FlatButton, FloatingActionButton, FontIcon } from 'material-ui'
import ModalDialog from '../ModalDialog'
import Points from 'components/common/Points/Points'
import Preloader from 'components/common/Preloader/Preloader'
import { modalsOpen, modalsClose } from 'redux/modals/actions'
import WalletAddEditDialog from './WalletAddEditDialog/WalletAddEditDialog'
import WalletMultiBigSVG from 'assets/img/icn-wallet-multi-big.svg'
import WalletDialogSVG from 'assets/img/icn-wallet-dialog.svg'
import { addOwner, removeWallet, selectWallet, multisigTransfer } from 'redux/multisigWallet/actions'
import type WalletModel from 'models/WalletModel'
import './WalletSelectDialog.scss'
import TokenValue from 'components/common/TokenValue/TokenValue'

const TRANSITION_TIMEOUT = 250

function mapStateToProps (state) {
  const {wallets, selected} = state.get('multisigWallet')
  return {
    wallets,
    selected
  }
}

function mapDispatchToProps (dispatch) {
  return {
    walletAddEditDialog: () => dispatch(modalsOpen({
      component: WalletAddEditDialog,
      props: {wallet: new WalletModel()}
    })),
    handleClose: () => dispatch(modalsClose()),
    selectWallet: (id) => dispatch(selectWallet(id)),
    removeWallet: (wallet) => dispatch(removeWallet(wallet)),
    addOwner: (wallet) => dispatch(addOwner(wallet)),
    transfer: (wallet) => dispatch(multisigTransfer(wallet))
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletSelectDialog extends React.Component {
  static propTypes = {
    handleClose: PropTypes.func,
    wallets: PropTypes.object,
    walletAddEditDialog: PropTypes.func,
    selectWallet: PropTypes.func,
    removeWallet: PropTypes.func,
    selected: PropTypes.string,
    transfer: PropTypes.func,
    addOwner: PropTypes.func
  }

  selectWallet (id) {
    this.props.handleClose()
    this.props.selectWallet(id)
  }

  render () {
    const {wallets} = this.props

    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={TRANSITION_TIMEOUT}
        transitionEnterTimeout={TRANSITION_TIMEOUT}
        transitionLeaveTimeout={TRANSITION_TIMEOUT}>
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
                  <FloatingActionButton
                    onTouchTap={() => this.props.walletAddEditDialog()}>
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
                  {wallets.map(item => this.renderRow(item))}
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

  renderRow (wallet: WalletModel) {

    const time = wallet.tokens().get('TIME')

    const isSelected = this.props.selected === wallet.address()
    return (
      <div key={wallet.id()} styleName={classNames('row', {'rowSelected': isSelected})}>
        <div>
          time: <TokenValue value={time.balance()} />
          tx: {wallet.pendingTxList().size}
          <FlatButton
            label='Add owner'
            onTouchTap={() => this.props.addOwner(wallet)}
          />
          <FlatButton
            label='transfer'
            onTouchTap={() => this.props.transfer(wallet)}
          />
        </div>
        <div styleName='cell' onTouchTap={() => !isSelected && this.selectWallet(wallet.id())}>
          <div>
            <img styleName='bigIcon' src={WalletMultiBigSVG} />
          </div>
        </div>
        <div styleName='cell cellAuto' onTouchTap={() => !isSelected && this.selectWallet(wallet.id())}>
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
              <i className='material-icons' styleName='controlItem' onTouchTap={() => {
                this.props.walletAddEditDialog()
              }}>edit</i>
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
