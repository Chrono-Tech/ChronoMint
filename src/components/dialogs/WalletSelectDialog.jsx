import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { CSSTransitionGroup } from 'react-transition-group'
import * as actions from 'redux/wallet/actions'

import { FloatingActionButton, FontIcon, CircularProgress } from 'material-ui'

import ModalDialog from './ModalDialog'
import Points from 'components/common/Points/Points'

import { modalsOpen, modalsClose } from 'redux/modals/actions'

import WalletAddEditDialog from './WalletAddEditDialog'

import './WalletSelectDialog.scss'

import walletMultiBig from 'assets/img/icn-wallet-multi-big.svg'
import walletDialog from'assets/img/icn-wallet-dialog.svg'

export class AddCurrencyDialog extends React.Component {

  static propTypes = {
    handleClose: PropTypes.func,
    wallets: PropTypes.array,
    isWalletsLoaded: PropTypes.bool,
    walletAddEditDialog: PropTypes.func,
    turnMultisig: PropTypes.func,
    turnAddNotEdit: PropTypes.func,
    turnEditMultisig: PropTypes.func,
  }

  static defaultProps = {
    wallets: [
      {name: 'Triple Wallet', owners: [1, 2, 3]},
      {name: 'Quadra Wallet', owners: [1, 2, 3, 4]},
      {name: 'Double Wallet', owners: [1, 2]},
      {name: 'Septa Wallet', owners: [1, 2, 3, 4, 5, 6, 7]},
      {name: 'Octa Wallet', owners: [1, 2, 3, 4, 5, 6, 7, 8]},
      {name: 'Nona Wallet', owners: [1, 2, 3, 4, 5, 6, 7, 8, 9]}
    ],
    isWalletsLoaded: true
  }

  constructor (props) {
    super(props)
    this.state = {wallets: this.props.wallets}
  }

  deleteWallet (idx) {
    const wallets = this.state.wallets;
    wallets.splice(idx, 1);
    this.setState({wallets})
  }

  render () {
    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}>
        <ModalDialog onClose={() => this.props.handleClose()}>
          <div styleName='content'>
            <div styleName='header'>
              <h3 styleName='headerTitle'>Multisignature wallets</h3>
              <div styleName='subtitle'>Add Wallet</div>
              <img styleName='headerBigicon' src={walletDialog} />
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
                <h5 styleName='colName'>{this.state.wallets.length ? 'Your wallets' : 'You have no wallets'}</h5>
                {this.props.isWalletsLoaded ?
                  <div styleName='table'>
                    { this.state.wallets.map((item, idx) => this.renderRow(item, idx)) }
                  </div> : <CircularProgress style={{marginTop: '25px'}} size={24} thickness={1.5} />
                }
              </div>
              <div styleName='column'>
                <h5 styleName='colName'>How to add mulisignature wallet? It&#39;s easy!</h5>
                <div styleName='description'>
                  <p>
                    To create a multi-sig wallet
                  </p>
                </div>
                <Points>
                  <span>
                    Click plus button at the top
                  </span>
                  <span>
                    Select owners, at least two
                  </span>
                  <span>
                    Select required number of signatures from owners
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
    const that = this;
    return (
      <div key={idx} styleName={classnames('row', { 'rowSelected': wallet.selected })}>
        <div styleName='cell' onTouchTap={that.selectThis}>
          <div>
            <img styleName='bigIcon' src={walletMultiBig} />
          </div>
        </div>
        <div styleName='cell cellAuto' onTouchTap={that.selectThis}>
          <div styleName='symbol'>{wallet.name}</div>
          <div>
            <span styleName='ownersNum'>{wallet.owners.length} owners</span>
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
            this.deleteWallet(idx);
          }}>delete</i>
        </div>
      </div>
    )
  }
}

function mapStateToProps () {
  return {
    isEditMultisig: state.get('wallet').isEditMultisig,
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

export default connect(mapStateToProps, mapDispatchToProps)(AddCurrencyDialog)
