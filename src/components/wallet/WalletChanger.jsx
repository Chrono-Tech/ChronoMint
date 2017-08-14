import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import WalletSelectDialog from 'components/dialogs/WalletSelectDialog'
import WalletAddEditDialog from 'components/dialogs/WalletAddEditDialog'
import { modalsOpen } from 'redux/modals/actions'

import './WalletChanger.scss'

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
    let icons = {
      walletMain: require('assets/img/icn-wallet-main.svg'),
      walletMainBig: require('assets/img/icn-wallet-main-big.svg'),
      walletMulti: require('assets/img/icn-wallet-multi.svg'),
      walletMultiBig: require('assets/img/icn-wallet-multi-big.svg')
    }

    return (
      <div>
        <div styleName='header'>
          <div styleName='flex'>
            <div styleName='bigicon' style={{background: `url(${this.props.isMultisig ? icons.walletMultiBig : icons.walletMainBig}) no-repeat center center`}}></div>
          </div>
          <div styleName='headerinfo'>
            <div styleName='title'>{this.props.walletName}</div>
            <div styleName='wallettype'>{this.props.isMultisig ? 'Multisignature' : 'Main wallet'}</div>
            <div styleName={this.props.isMultisig ? 'stub' : 'none'}>
              <div styleName='ownersnum'>
                {this.props.owners.length} owners:
              </div>
              <div styleName='flexrow'>
                {this.props.owners.map((owner, idx) => (
                  <div key={idx} styleName='iconholder'>
                    <i className='material-icons' style={{fontSize: '32px'}}>account_circle</i>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div styleName='body'>
          <div>
            <div>You have:</div>
            <span styleName='walletscnt'>{this.props.wallets.length}
            </span>
            <span styleName='walletscnttype'>Multisignature wallets</span>
          </div>
          <div styleName='flexrow'>
            <div styleName={this.props.isMultisig ? 'mainwalletswitcher' : 'mainwalletswitcher hidden'}>
              <div styleName='smallicon' style={{background: `url(${icons.walletMain}) no-repeat center center`}}></div>
              <span styleName='switchtext'>Swith to main wallet</span>
            </div>
            <div styleName='mainwalletswitcher'>
              <div styleName='smallicon' style={{background: `url(${icons.walletMulti}) no-repeat center center`}}></div>
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
