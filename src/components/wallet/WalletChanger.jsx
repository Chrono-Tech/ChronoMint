import { FloatingActionButton, FontIcon } from 'material-ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import walletMain from 'assets/img/icn-wallet-main.svg'
import walletMainBig from 'assets/img/icn-wallet-main-big.svg'
import walletMulti from 'assets/img/icn-wallet-multi.svg'
import walletMultiBig from 'assets/img/icn-wallet-multi-big.svg'

import * as actions from 'redux/wallet/actions'
import { modalsOpen } from 'redux/modals/actions'

import WalletAddEditDialog from 'components/dialogs/wallet/WalletAddEditDialog/WalletAddEditDialog'
import WalletSelectDialog from 'components/dialogs/wallet/WalletSelectDialog'

import './WalletChanger.scss'

function mapStateToProps (state) {
  return {
    isMultisig: state.get('wallet').isMultisig,
    wallets: state.get('wallet').wallets,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    walletSelectDialog: () => dispatch(modalsOpen({
      component: WalletSelectDialog,
    })),
    walletAddEditDialog: () => dispatch(modalsOpen({
      component: WalletAddEditDialog,
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
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletChanger extends React.Component {
  /** @namespace PropTypes.func */
  /** @namespace PropTypes.array */
  /** @namespace PropTypes.bool */
  /** @namespace PropTypes.string */
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
    turnEditNotAdd: PropTypes.func,
    turnEditMultisig: PropTypes.func,
    turnEditMain: PropTypes.func,
    locale: PropTypes.string,
  }

  static defaultProps = {
    walletName: '',
    wallets: [],
    owners: [1, 2, 3],
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
            <div styleName='walletType'>
              <Translate value={this.props.isMultisig ? 'wallet.multisignature' : 'wallet.mainWallet'} />
            </div>
            <div styleName={this.props.isMultisig ? '' : 'none'}>
              <div styleName='ownersNum'>
                {this.props.owners.length} <Translate value='wallet.owners' />:
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
              }}
              >
                <FontIcon className='material-icons'>edit</FontIcon>
              </FloatingActionButton>
            </div>
          </div>
        </div>
        <div styleName='body'>
          <div>
            <div><Translate value='wallet.youHave' />:</div>
            <span styleName='walletsCount'>{this.props.wallets.length}</span>
            <span styleName='walletsCountType'><Translate value='wallet.multisignatureWallets' /></span>
          </div>
          <div styleName='flexRow'>
            <div styleName={this.props.isMultisig ? 'mainWalletSwitcher' : 'mainWalletSwitcher hidden'}>
              <img styleName='smallIcon' src={walletMain} onTouchTap={() => this.props.turnMain()} />
              <span
                styleName='switchText'
                onTouchTap={() => this.props.turnMain()}
              ><Translate value='wallet.switchToMainWallet' />
              </span>
            </div>
            <div styleName='mainWalletSwitcher'>
              <img
                styleName='smallIcon'
                src={walletMulti}
                onTouchTap={() => {
                  this.props.walletSelectDialog()
                }}
              />
              <span
                styleName='switchText'
                onTouchTap={() => {
                  this.props.walletSelectDialog()
                }}
              >
                <Translate value='wallet.switchMultisignatureWallet' />
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
