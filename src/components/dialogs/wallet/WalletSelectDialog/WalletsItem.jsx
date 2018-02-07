import TokenValue from 'components/common/TokenValue/TokenValue'
import WalletMultiSVG from 'assets/img/icn-wallet-multi-big.svg'
import classnames from 'classnames'
import Moment from 'components/common/Moment'
import Preloader from 'components/common/Preloader/Preloader'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import { prefix } from './lang'
import './WalletsItem.scss'

export default class WalletsItem extends PureComponent {
  static propTypes = {
    wallet: PropTypes.instanceOf(MultisigWalletModel),
    onRemove: PropTypes.func,
    onEditOwners: PropTypes.func,
    onEditSignatures: PropTypes.func,
    onSelect: PropTypes.func,
  }

  handleEditOwners = () => this.props.onEditOwners(this.props.wallet)

  handleEditSignatures = () => this.props.onEditSignatures(this.props.wallet)

  handleRemove = () => this.props.onRemove(this.props.wallet)

  handleSelect = () => this.props.onSelect(this.props.wallet)

  render () {
    const { wallet } = this.props
    const ownersCount = wallet.owners().size()
    const isSelected = wallet.isSelected()
    const isPending = wallet.isPending()
    const title = !isPending && !isSelected
      ? I18n.t(`${prefix}.selectWallet`)
      : null

    return (
      <div styleName='root'>
        <div
          styleName={classnames('iconBox', { selected: isSelected })}
          onTouchTap={!isSelected && this.handleSelect}
          title={title}
        >
          <img styleName='icon' src={WalletMultiSVG} />
        </div>
        <div styleName='content'>
          <div styleName='info'>
            <div
              styleName='title'
              onTouchTap={!isPending && !isSelected && this.handleSelect}
              title={title}
            >
              {/*<div styleName='name'>Name</div>*/}
              <div styleName={classnames('address', { link: !isPending && !isSelected && !!wallet.address() })}>
                {
                  wallet.address()
                    ? wallet.address()
                    : <Translate value={`${prefix}.pending`} />
                }
              </div>
            </div>
            {!wallet.isTimeLocked() && (
              <div styleName='actions'>
                {wallet.isPending()
                  ? <Preloader small />
                  : (
                    <div
                      styleName='action'
                      className='material-icons'
                      onTouchTap={this.handleRemove}
                    >
                      delete
                    </div>
                  )
                }
              </div>
            )}
          </div>
          <div styleName='details'>
            <div styleName='detailCol'>
              <div
                styleName={classnames('detailItem', { link: !isPending })}
                onTouchTap={!isPending && this.handleEditOwners}
              >
                <strong>{ownersCount}</strong> <Translate value={`${prefix}.owners`} count={ownersCount} />
              </div>
              <div
                styleName={classnames('detailItem', { link: !isPending })}
                onTouchTap={!isPending && this.handleEditSignatures}
              >
                <strong>{wallet.requiredSignatures()}</strong> <Translate value={`${prefix}.requiredSignatures`} />
              </div>
            </div>
            <div styleName='detailCol'>
              <div styleName={classnames('detailItem', { red: wallet.pendingCount() > 0 })}>
                <strong>{wallet.pendingCount()}</strong>
              </div>
              <div styleName='detailItem'><Translate value={`${prefix}.pendings`} /></div>
            </div>
            <div styleName='detailCol'>
              <div styleName='detailItem'>
                <strong>
                  <TokenValue
                    value={wallet.balances().item('ETH').amount()}
                    noRenderPrice
                  />
                </strong>
              </div>
              <div styleName='detailItem'><Translate value={`${prefix}.availableFunds`} /></div>
            </div>
            {wallet.isTimeLocked() && (
              <div styleName='detailCol'>
                <div styleName='detailItem'><strong><Moment date={wallet.releaseTime()} /></strong></div>
                <div styleName='detailItem'><Translate value={`${prefix}.unlockDate`} /></div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}
