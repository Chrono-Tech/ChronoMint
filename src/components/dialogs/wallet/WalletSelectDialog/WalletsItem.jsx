import WalletMultiSVG from 'assets/img/icn-wallet-multi-big.svg'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import './WalletsItem.scss'

export default class WalletsItem extends PureComponent {
  static propTypes = {
    wallet: PropTypes.instanceOf(MultisigWalletModel),
    onRemove: PropTypes.func,
    onEdit: PropTypes.func,
  }

  render () {
    const { wallet } = this.props

    return (
      <div styleName='root'>
        <div styleName='iconBox'><img styleName='icon' src={WalletMultiSVG} /></div>
        <div styleName='content'>
          <div styleName='info'>
            <div styleName='title'>
              <div styleName='name'>Name</div>
              <div styleName='address'>0xb7237dd7dacd9da8e489b57d4631fc33342ff75f</div>
            </div>
            <div styleName='actions'>
              <div styleName='action grey' className='material-icons'>delete</div>
              <div styleName='action secondary' className='material-icons'>settings</div>
            </div>
          </div>
          <div styleName='details'>
            <div styleName='detailCol'>
              <div styleName='detailItem'><strong>3</strong> owners</div>
              <div styleName='detailItem'><strong>2</strong> req sig</div>
            </div>
            <div styleName='detailCol'>
              <div styleName='detailItem red'><strong>2</strong></div>
              <div styleName='detailItem'>pendings</div>
            </div>
            <div styleName='detailCol'>
              <div styleName='detailItem'>Available funds:</div>
              <div styleName='detailItem'><strong>0 ETH</strong></div>
            </div>
            <div styleName='detailCol'>
              <div styleName='detailItem'><strong>Date</strong></div>
              <div styleName='detailItem'>UnlockDate</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
