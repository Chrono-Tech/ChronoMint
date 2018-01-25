import WalletMultiSVG from 'assets/img/icn-wallet-multi-big.svg'
import Moment from 'components/common/Moment'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import './WalletsItem.scss'

export default class WalletsItem extends PureComponent {
  static propTypes = {
    wallet: PropTypes.instanceOf(MultisigWalletModel),
    onRemove: PropTypes.func,
    onEditOwners: PropTypes.func,
  }

  handleEditOwners = () => this.props.onEditOwners(this.props.wallet)

  render () {
    const { wallet } = this.props

    return (
      <div styleName='root'>
        <div styleName='iconBox'><img styleName='icon' src={WalletMultiSVG} /></div>
        <div styleName='content'>
          <div styleName='info'>
            <div styleName='title'>
              {/*<div styleName='name'>Name</div>*/}
              <div styleName='address'>{wallet.address()}</div>
            </div>
            <div styleName='actions'>
              <div styleName='action grey' className='material-icons'>delete</div>
              <div styleName='action secondary' className='material-icons'>settings</div>
            </div>
          </div>
          <div styleName='details'>
            <div styleName='detailCol'>
              <div
                styleName='detailItem link'
                onTouchTap={this.handleEditOwners}
              >
                <strong>{wallet.owners().size()}</strong> owners
              </div>
              <div styleName='detailItem link'>
                <strong>{wallet.requiredSignatures()}</strong> Signatures req.
              </div>
            </div>
            <div styleName='detailCol'>
              <div styleName='detailItem red'><strong>{wallet.pendingCount()}</strong></div>
              <div styleName='detailItem'>pendings</div>
            </div>
            <div styleName='detailCol'>
              <div styleName='detailItem'>Available funds:</div>
              <div styleName='detailItem'><strong>TODO ETH</strong></div>
            </div>
            {wallet.isTimeLocked() && (
              <div styleName='detailCol'>
                <div styleName='detailItem'><strong><Moment date={wallet.releaseTime()} /></strong></div>
                <div styleName='detailItem'>UnlockDate</div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}
