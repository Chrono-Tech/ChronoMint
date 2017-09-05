import React from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { CSSTransitionGroup } from 'react-transition-group'
import * as actions from 'redux/wallet/actions'

import { FloatingActionButton, FontIcon, CircularProgress } from 'material-ui'

import ModalDialog from '../ModalDialog'
import Points from 'components/common/Points/Points'

import { modalsOpen, modalsClose } from 'redux/modals/actions'

import WalletAddEditDialog from './WalletAddEditDialog/WalletAddEditDialog'

import './WalletSelectDialog.scss'

import walletMultiBig from 'assets/img/icn-wallet-multi-big.svg'
import walletDialog from'assets/img/icn-wallet-dialog.svg'

const TRANSITION_TIMEOUT = 250
const CP_SIZE = 24
const CP_THICKNESS = 1.5

function mapStateToProps (state) {
  return {
    isEditMultisig: state.get('wallet').isEditMultisig
  }
}

function mapDispatchToProps (dispatch) {
  return {
    walletAddEditDialog: () => dispatch(modalsOpen({
      component: WalletAddEditDialog
    })),
    handleClose: () => dispatch(modalsClose()),
    turnMultisig: () => {
      dispatch(actions.turnMultisig())
    },
    turnAddNotEdit: () => {
      dispatch(actions.turnAddNotEdit())
    },
    turnEditNotAdd: () => {
      dispatch(actions.turnEditNotAdd())
    },
    turnEditMultisig: () => {
      dispatch(actions.turnEditMultisig())
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletSelectDialog extends React.Component {
  /** @namespace PropTypes.func */
  /** @namespace PropTypes.array */
  /** @namespace PropTypes.bool */
  /** @namespace PropTypes.string */
  static propTypes = {
    handleClose: PropTypes.func,
    wallets: PropTypes.array,
    isWalletsLoaded: PropTypes.bool,
    walletAddEditDialog: PropTypes.func,
    turnMultisig: PropTypes.func,
    turnAddNotEdit: PropTypes.func,
    turnEditNotAdd: PropTypes.func,
    turnEditMultisig: PropTypes.func,
    locale: PropTypes.string
  }

  //noinspection SpellCheckingInspection
  static defaultProps = {
    wallets: [
      {name: 'Triple Wallet', owners: [1, 2, 3]},
      {name: 'Quadra Wallet', owners: [1, 2, 3, 4]},
      {name: 'Double Wallet', owners: [1, 2]},
      {name: 'Septa Wallet', owners: [1, 2, 3, 4, 5, 6, 7]},
      {name: 'Octo Wallet', owners: [1, 2, 3, 4, 5, 6, 7, 8]},
      {name: 'Nona Wallet', owners: [1, 2, 3, 4, 5, 6, 7, 8, 9]}
    ],
    isWalletsLoaded: true
  }

  constructor (props) {
    super(props)
    this.state = {wallets: this.props.wallets}
  }

  deleteWallet (idx) {
    const wallets = this.state.wallets
    wallets.splice(idx, 1)
    this.setState({wallets})
  }

  render () {
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
              <img styleName='headerBigIcon' src={walletDialog} />
            </div>
            <div styleName='actions'>
              <div styleName='actionsItems'>
                <div styleName='actionsItem'>
                  <FloatingActionButton onTouchTap={() => {
                    this.props.turnAddNotEdit()
                    this.props.turnEditMultisig()
                    this.props.walletAddEditDialog()
                  }}>
                    <FontIcon className='material-icons'>add</FontIcon>
                  </FloatingActionButton>
                </div>
              </div>
            </div>
            <div styleName='body'>
              <div styleName='column'>
                <h5 styleName='colName'>
                  <Translate
                    value={'wallet.walletSelectDialog.' + (this.state.wallets.length ? 'yourWallets' : 'youHaveNoWallets')} />
                </h5>
                {this.props.isWalletsLoaded ?
                  <div styleName='table'>
                    { this.state.wallets.map((item, idx) => this.renderRow(item, idx)) }
                  </div> : <CircularProgress style={{marginTop: '25px'}} size={CP_SIZE} thickness={CP_THICKNESS} />
                }
              </div>
              <div styleName='column'>
                <h5
                  styleName='colName'><Translate value='wallet.walletSelectDialog.howToAddMultisignatureWallet' /></h5>
                <div styleName='description'>
                  <p>
                    <Translate value='wallet.walletSelectDialog.toCreateAMultisigWallet' />
                  </p>
                </div>
                <Points>
                  <span>
                    <Translate value='wallet.walletSelectDialog.clickPlusButtonAtTheTop' />
                  </span>
                  <span>
                    <Translate value='wallet.walletSelectDialog.selectOwnersAtLeastTwo' />
                  </span>
                  <span>
                    <Translate value='wallet.walletSelectDialog.selectRequiredNumberOfSignaturesFromOwners' />
                  </span>
                </Points>
              </div>
            </div>
          </div>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }

  selectThis = () => {
    this.props.turnMultisig()
    this.props.handleClose()
  }

  renderRow (wallet, idx) {
    return (
      <div key={idx} styleName={classNames('row', { 'rowSelected': wallet.selected })}>
        <div styleName='cell' onTouchTap={this.selectThis}>
          <div>
            <img styleName='bigIcon' src={walletMultiBig} />
          </div>
        </div>
        <div styleName='cell cellAuto' onTouchTap={this.selectThis}>
          <div styleName='symbol'>{wallet.name}</div>
          <div>
            <span styleName='ownersNum'>
              {wallet.owners.length} <Translate value='wallet.walletSelectDialog.owners' />
            </span>
            <div>
              {wallet.owners.map((owner, idx) => <i
                className='material-icons'
                key={owner}
                styleName={ wallet.owners.length > 4 && idx ? 'faces tight' : 'faces'}
              >account_circle</i>)}
            </div>
          </div>
        </div>
        <div styleName='cell control'>
          <i className='material-icons' styleName='controlItem' onTouchTap={() => {
            this.props.turnEditNotAdd()
            this.props.turnEditMultisig()
            this.props.walletAddEditDialog()
          }}>edit</i>
          <i className='material-icons' styleName='controlItem' onTouchTap={() => {
            this.deleteWallet(idx)
          }}>delete</i>
        </div>
      </div>
    )
  }
}
