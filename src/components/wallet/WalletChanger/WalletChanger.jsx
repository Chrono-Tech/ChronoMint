import React from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FlatButton, Paper } from 'material-ui'
import WalletSelectDialog from 'components/dialogs/wallet/WalletSelectDialog'
import WalletAddEditDialog from 'components/dialogs/wallet/WalletAddEditDialog/WalletAddEditDialog'
import { modalsOpen } from 'redux/modals/actions'
import * as actions from 'redux/multisigWallet/actions'
import classNames from 'classnames'
import walletMain from 'assets/img/icn-wallet-main.svg'
import walletMainBig from 'assets/img/icn-wallet-main-big.svg'
import walletMulti from 'assets/img/icn-wallet-multi.svg'
import walletMultiBig from 'assets/img/icn-wallet-multi-big.svg'
import globalStyles from 'layouts/partials/styles'
import WalletModel from 'models/WalletModel'
import './WalletChanger.scss'
import { switchWallet } from 'redux/wallet/actions'
import Preloader from 'components/common/Preloader/Preloader'

function mapStateToProps (state) {
  return {
    isMultisig: state.get('wallet').isMultisig,
    account: state.get('session').account,
    ...state.get('multisigWallet')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    walletSelectDialog: () => dispatch(modalsOpen({
      component: WalletSelectDialog
    })),
    walletAddEditDialog: () => dispatch(modalsOpen({
      component: WalletAddEditDialog,
      props: {wallet: new WalletModel()}
    })),
    getWallets: () => dispatch(actions.getWallets()),
    switchWallet: (isMultisig) => dispatch(switchWallet(isMultisig))
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletChanger extends React.Component {
  static propTypes = {
    isMultisig: PropTypes.bool,
    wallets: PropTypes.object,
    walletSelectDialog: PropTypes.func,
    walletAddEditDialog: PropTypes.func,
    getWallets: PropTypes.func,
    switchWallet: PropTypes.func,
    account: PropTypes.string,
    isFetching: PropTypes.bool,
    isFetched: PropTypes.bool,
    selected: PropTypes.string
  }

  componentWillMount () {
    if (!this.props.isFetched || !this.props.isFetching) {
      this.props.getWallets()
    }
  }

  handleCreateWallet () {
    this.props.walletAddEditDialog()
  }

  renderMainWallet () {
    const {isMultisig, account, wallets, isFetching} = this.props
    return (
      <div styleName={classNames('walletBox', {'isMultisig': isMultisig})}>
        <Paper style={globalStyles.content.paper.style}>
          <div styleName='header'>
            <img styleName='headerIcon' src={walletMainBig} />
            <div styleName='headerInfo'>
              <div styleName='headerTitle'><Translate value='wallet.mainWallet' /></div>
              <div styleName='headerSubtitle'>{account}</div>
            </div>
          </div>

          <div styleName='body'>
            <div styleName='actions'>
              <div styleName='action' />
              <div styleName='action'>
                <FlatButton
                  label={isFetching
                    ? <Preloader />
                    : (
                      <span styleName='buttonLabel'>
                        <img styleName='buttonIcon' src={walletMulti} />
                        <Translate value={wallets.size > 0 ? 'wallet.switchToMultisignatureWallet' : 'wallet.createMultisignatureWallet'} />
                      </span>
                    )}
                  onTouchTap={wallets.size > 0
                    ? () => this.props.switchWallet(true)
                    : () => this.handleCreateWallet()}
                  disabled={isFetching}
                  {...globalStyles.buttonWithIconStyles}
                />
              </div>
            </div>
          </div>
        </Paper>
      </div>
    )
  }

  renderMultisigWallet () {
    const {wallets, selected} = this.props

    const selectedWallet = wallets.get(selected)
    const owners = selectedWallet.owners()

    return (
      <div styleName='walletBox'>
        <Paper style={globalStyles.content.paper.style}>
          <div styleName='header'>
            <img styleName='headerIcon' src={walletMultiBig} />
            <div styleName='headerInfo'>
              <div styleName='headerTitle'>{selectedWallet.name() || 'No name'}</div>
              <div styleName='headerSubtitle'>Multisignature wallet</div>
              <div styleName='headerSubtitle'>{selectedWallet.address()}</div>
              <div>
                <div styleName='ownersNum'>
                  {owners.size + 1} <Translate value='wallet.owners' />:
                </div>
                <div styleName='owners'>
                  <div key='account' styleName='iconHolder'>
                    <i className='material-icons'>account_circle</i>
                  </div>
                  {owners.map((owner, idx) => (
                    <div key={idx} styleName='iconHolder'>
                      <i className='material-icons'>account_circle</i>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div styleName='body'>
            <div><Translate value='wallet.youHave' />:</div>
            <div>
              <span styleName='walletsCount'>{wallets.size}</span>
              <span styleName='walletsCountType'><Translate value='wallet.multisignatureWallets' /></span>
            </div>

            <div styleName='actions'>
              <div styleName='action'>
                <FlatButton
                  label={(
                    <span styleName='buttonLabel'>
                      <img styleName='buttonIcon' src={walletMain} />
                      <Translate value='wallet.switchToMainWallet' />
                    </span>
                  )}
                  onTouchTap={() => this.props.switchWallet(false)}
                  {...globalStyles.buttonWithIconStyles}
                />
              </div>
              <div styleName='action'>
                <FlatButton
                  label={(
                    <span styleName='buttonLabel'>
                      <img styleName='buttonIcon' src={walletMulti} />
                      <Translate value='wallet.changeMultisignatureWallet' />
                    </span>
                  )}
                  onTouchTap={() => this.props.walletSelectDialog()}
                  {...globalStyles.buttonWithIconStyles}
                />
              </div>
            </div>
          </div>
        </Paper>
      </div>
    )
  }

  render () {
    return (
      <div styleName={classNames('root', {'isMultisig': this.props.isMultisig})}>
        {this.renderMainWallet()}
        {this.props.selected && this.renderMultisigWallet()}
      </div>
    )
  }
}
