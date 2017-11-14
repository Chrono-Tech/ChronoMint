import UserIcon from 'components/common/HashedIcon/UserIcon'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import './EditManagersBaseForm.scss'

class ManagerItem extends PureComponent {
  static propTypes = {
    manager: PropTypes.string.isRequired,
    account: PropTypes.string.isRequired,
    onRemove: PropTypes.func.isRequired,
  }

  handleRemoveManager = () => {
    this.props.onRemove(this.props.manager)
  }

  renderRemoveIcon () {
    const { account, manager } = this.props

    return account !== manager && (
      <div onTouchTap={this.handleRemoveManager} styleName='action' role='button'>
        <i className='material-icons'>delete</i>
      </div>
    )
  }

  render () {
    const { manager } = this.props
    return (
      <div styleName='row'>
        <div styleName='iconBox'>
          <UserIcon styleName='icon' account={manager} />
        </div>
        <div styleName='address'>{manager}</div>
        {this.renderRemoveIcon()}
      </div>
    )
  }
}

export default ManagerItem
