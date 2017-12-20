import CirclePlusSVG from 'assets/img/icn-circle-plus.svg'
import globalStyles from 'layouts/partials/styles'
import { FlatButton } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import { Field } from 'redux-form/immutable'
import { DUCK_SESSION } from 'redux/session/actions'
import './OwnersList.scss'

function mapStateToProps (state) {
  return {
    account: state.get(DUCK_SESSION).account,
  }
}

@connect(mapStateToProps, null)
class OwnersList extends PureComponent {
  static propTypes = {
    account: PropTypes.string,
    meta: PropTypes.object,
    fields: PropTypes.object,
  }

  renderOwners (fields) {
    return (
      <div>
        {fields.map((item, index) => (
          <div styleName='ownerBox' key={index}>
            <div styleName='ownerIcon' className='material-icons'>account_circle</div>
            <div styleName='ownerInput'>
              <Field
                component={TextField}
                name={`${item}.address`}
                id={`${item}.address`}
                placeholder='0x123...'
              />
            </div>
            <div styleName='ownerRemove'>
              <FlatButton
                icon={<i className='material-icons'>delete</i>}
                onTouchTap={() => {fields.remove(index)}}
                fullWidth
              />
            </div>
          </div>
        ))}

        <div styleName='addOwnerButton'>
          <FlatButton
            label={(
              <span styleName='buttonLabel'>
                <img styleName='buttonIcon' src={CirclePlusSVG} />
                <Translate value='WalletAddEditDialog.addOwner' />
              </span>
            )}
            onTouchTap={() => fields.push()}
            {...globalStyles.buttonWithIconStyles}
          />
        </div>
      </div>
    )
  }

  render () {
    const { account, fields } = this.props

    return (
      <div>
        <div styleName='counterBox'>
          <Translate value='wallet.walletAddEditDialog.walletOwners' /> &mdash; <span
          styleName='counter'
        >{fields.length + 1}
          </span>
        </div>
        <div styleName='counterError'>{this.props.meta.error}</div>

        <div styleName='accountBox'>
          <div styleName='accountIcon' className='material-icons'>account_circle</div>
          <div styleName='accountValue'>{account} ({<Translate value='WalletAddEditForm.you' />})</div>
        </div>

        {this.renderOwners(fields)}
      </div>
    )
  }
}

export default OwnersList
