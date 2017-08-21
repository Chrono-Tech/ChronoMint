import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import WalletSelectDialog from 'components/dialogs/WalletSelectDialog'
import WalletAddEditDialog from 'components/dialogs/WalletAddEditDialog'
import { modalsOpen } from 'redux/modals/actions'

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
    walletAddEditDialog: PropTypes.func
  }

  static defaultProps = {
    walletName: '',
    wallets: [],
    owners: [1, 2, 3]
  }

  constructor (props) {
    super(props)
    window.walletSelectDialog = props.walletSelectDialog
    window.walletAddEditDialog = props.walletAddEditDialog
  }

  render () {

    return (
      <div>
        <div styleName='header'>
          <div styleName='flex'>
            <img styleName='bigicon' src={this.props.isMultisig ? walletMultiBig : walletMainBig}></img>
          </div>
          <div styleName='headerinfo'>
            <div styleName='title'>{this.props.walletName}</div>
            <div styleName='wallettype'>{this.props.isMultisig ? 'Multisignature' : 'Main wallet'}</div>
            <div styleName={this.props.isMultisig ? '' : 'none'}>
              <div styleName='ownersnum'>
                {this.props.owners.length} owners:
              </div>
              <div styleName='flexrow'>
                {this.props.owners.map((owner, idx) => (
                  <div key={idx} styleName='iconholder'>
                    <i className='material-icons'>account_circle</i>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div styleName='body'>
          <div>
            <div>You have:</div>
            <span styleName='walletscnt'>{this.props.wallets.length}</span>
            <span styleName='walletscnttype'>Multisignature wallets</span>
          </div>
          <div styleName='flexrow'>
            <div styleName={this.props.isMultisig ? 'mainwalletswitcher' : 'mainwalletswitcher hidden'}>
              <img styleName='smallicon' src={walletMain}></img>
              <span styleName='switchtext'>Swith to main wallet</span>
            </div>
            <div styleName='mainwalletswitcher'>
              <img styleName='smallicon' src={walletMulti}></img>
              <span styleName='switchtext'>Swith multisignature wallet</span>
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
    }))
  }
}

function mapStateToProps (state) {
  return {
    isMultisig: state.get('wallet').isMultisig,
    wallets: state.get('wallet').wallets
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletChanger)
