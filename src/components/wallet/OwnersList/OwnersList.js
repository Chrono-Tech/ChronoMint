import CirclePlusSVG from 'assets/img/icn-circle-plus.svg'
import globalStyles from 'layouts/partials/styles'
import { FlatButton } from 'material-ui'
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

  handleRemoveItem = (fields, index) => () => fields.remove(index)

  handleAddItem = (fields) => () => fields.push()

  render () {
    const { account, fields } = this.props

    return (
      <div>
        <div>
          <OwnerItem
            title={<Translate value={`${prefix}.you`} />}
            address={account}
            isNoActions
          />

          {fields.map((item, index) => (
            <OwnerItem
              address={item.address}
              onRemove={this.handleRemoveItem(fields, index)}
            />
          ))}
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
            onTouchTap={this.handleAddItem(fields)}
            {...globalStyles.buttonWithIconStyles}
          />
        </div>
      </div>
    )
  }
}
