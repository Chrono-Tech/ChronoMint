import CirclePlusSVG from 'assets/img/icn-circle-plus.svg'
import globalStyles from 'layouts/partials/styles'
import { FlatButton } from 'material-ui'
import { TextField } from 'redux-form-material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DUCK_SESSION } from 'redux/session/actions'
import { prefix } from './lang'
import OwnerItem from './OwnerItem'
import './OwnersList.scss'

function mapStateToProps (state) {
  return {
    account: state.get(DUCK_SESSION).account,
  }
}

@connect(mapStateToProps, null)
export default class OwnersList extends PureComponent {
  static propTypes = {
    account: PropTypes.string,
    meta: PropTypes.object,
    fields: PropTypes.object,
  }

  constructor () {
    super(...arguments)
    this.state = {
      owners: [],
    }
  }

  handleRemoveItem = (index) => () => {
    const newOwners = [...this.state.owners]
    newOwners.splice(index, 1)
    this.setState({
      owners: newOwners,
    })
  }

  handleAddItem = () => {
    const owners = [
      ...this.state.owners,
      this.input.value,
    ]
    this.setState({ owners })
    this.props.input.onChange(owners)
  }

  render () {
    const { account } = this.props
    const { owners } = this.state

    return (
      <div>
        <div>
          <OwnerItem
            title={<Translate value={`${prefix}.you`} />}
            address={account}
            isNoActions
          />

          {owners.map((address, index) => (
            <OwnerItem
              address={address}
              onRemove={this.handleRemoveItem(index)}
            />
          ))}
        </div>

        <div styleName='addOwner'>
          <div styleName='addOwnerField'>
            <TextField
              ref={(input) => this.input = input}
              name='owners.address'
              floatingLabelText={<Translate value={`${prefix}.floatText`} />}
            />
          </div>
          <div styleName='addOwnerButton'>
            {/* TODO: update to field */}
            <FlatButton
              label={(
                <span styleName='buttonLabel'>
                <img styleName='buttonIcon' src={CirclePlusSVG} />
                <Translate value='WalletAddEditDialog.addOwner' />
              </span>
              )}
              onTouchTap={this.handleAddItem}
              {...globalStyles.buttonWithIconStyles}
            />
          </div>
        </div>

      </div>
    )
  }
}
