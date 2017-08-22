import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FloatingActionButton, FontIcon } from 'material-ui'
import WalletSelectDialog from 'components/dialogs/WalletSelectDialog'
import WalletAddEditDialog from 'components/dialogs/WalletAddEditDialog'
import { modalsOpen } from 'redux/modals/actions'
import * as actions from 'redux/wallet/actions'

import './WalletChanger.scss'

import walletMain from 'assets/img/icn-wallet-main.svg'
import walletMainBig from 'assets/img/icn-wallet-main-big.svg'
import walletMulti from 'assets/img/icn-wallet-multi.svg'
import walletMultiBig from 'assets/img/icn-wallet-multi-big.svg'

export class WalletChanger extends React.Component {
  static propTypes = {
    walletName: PropTypes.string,
    isMultisig: PropTypes.bool,
    wallets: PropTypes.array,
    owners: PropTypes.array,
    walletSelectDialog: PropTypes.func,
    walletAddEditDialog: PropTypes.func,
    getWallets: PropTypes.func,
    createWallet: PropTypes.func,
    turnMain: PropTypes.func,
    turnEditNotAdd: PropTypes.func
  }

  static defaultProps = {
    walletName: '',
    wallets: [],
    owners: [1, 2, 3]
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {

    return (
      <div>
        <div styleName='header'>
          <div styleName='flex'>
            <img styleName='bigIcon' src={this.props.isMultisig ? walletMultiBig : walletMainBig} />
          </div>
          <div styleName='headerInfo'>
            <div styleName='title'>{this.props.walletName}</div>
            <div styleName='walletType'>{this.props.isMultisig ? 'Multisignature' : 'Main wallet'}</div>
            <div styleName={this.props.isMultisig ? '' : 'none'}>
              <div styleName='ownersNum'>
                {this.props.owners.length} owners:
              </div>
              <div styleName='flexRow'>
                {this.props.owners.map((owner, idx) => (
                  <div key={idx} styleName='iconHolder'>
                    <i className='material-icons'>account_circle</i>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div styleName='actions'>
          <div styleName='actionsItems'>
            <div styleName='actionsItem'>
              <FloatingActionButton onTouchTap={() => {
                this.props.turnEditNotAdd()
                this.props.isMultisig ? this.props.turnEditMultisig() : this.props.turnEditMain()
                this.props.walletAddEditDialog()
              }}>
                <FontIcon className='material-icons'>edit</FontIcon>
              </FloatingActionButton>
            </div>
          </div>
        </div>
        <div styleName='body'>
          <div>
            <div>You have:</div>
            <span styleName='walletsCount'>{this.props.wallets.length}</span>
            <span styleName='walletsCountType'>Multisignature wallets</span>
          </div>
          <div styleName='flexRow'>
            <div styleName={this.props.isMultisig ? 'mainWalletSwitcher' : 'mainWalletSwitcher hidden'}>
              <img styleName='smallIcon' src={walletMain} onTouchTap={() => this.props.turnMain()} />
              <span styleName='switchText' onTouchTap={() => this.props.turnMain()}>Switch to main wallet</span>
            </div>
            <div styleName='mainWalletSwitcher'>
              <img styleName='smallIcon' src={walletMulti} onTouchTap={() => {this.props.walletSelectDialog()}} />
              <span styleName='switchText' onTouchTap={() => {this.props.walletSelectDialog()}}>
                Switch multisignature wallet
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    walletSelectDialog: () => dispatch(modalsOpen({
      component: WalletSelectDialog
    })),
    walletAddEditDialog: () => dispatch(modalsOpen({
      component: WalletAddEditDialog
    })),
    getWallets: () => {
      dispatch(actions.getWallets())
    },
    createWallet: (walletOwners, requiredSignaturesNum, walletName) => {
      dispatch(actions.createWallet(walletOwners, requiredSignaturesNum, walletName))
    },
    turnMain: () => {
      dispatch(actions.turnMain())
    },
    turnEditNotAdd: () => {
      dispatch(actions.turnEditNotAdd())
    },
    turnEditMultisig: () => {
      dispatch(actions.turnEditMultisig())
    },
    turnEditMain: () => {
      dispatch(actions.turnEditMain())
    }
  }
}

function mapStateToProps (state) {
  return {
    isMultisig: state.get('wallet').isMultisig,
    wallets: state.get('wallet').wallets,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletChanger)
