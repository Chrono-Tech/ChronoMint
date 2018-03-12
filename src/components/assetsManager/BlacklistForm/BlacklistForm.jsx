import { FlatButton } from 'material-ui'
import OwnerCollection from 'models/wallet/OwnerCollection'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import { Field, formPropTypes, reduxForm } from 'redux-form/immutable'
import { DUCK_SESSION } from 'redux/session/actions'
import UserIcon from 'components/common/HashedIcon/UserIcon'
import BlacklistModel from 'models/tokens/BlacklistModel'
import './BlacklistForm.scss'
import validate from './validate'
import { prefix } from './lang'

export const FORM_ASSET_MANAGER = 'AssetManagerDialog'

const onSubmit = (values) => {
  return values.get('userAddress')
}

function mapStateToProps (state) {
  return {
    account: state.get(DUCK_SESSION).account,
  }
}

@connect(mapStateToProps, null)
@reduxForm({ form: FORM_ASSET_MANAGER, validate, onSubmit })
export default class BlacklistForm extends PureComponent {
  static propTypes = {
    account: PropTypes.string,
    managers: PropTypes.instanceOf(OwnerCollection),
    onRemoveFromBlacklist: PropTypes.func,
    blacklist: PropTypes.instanceOf(BlacklistModel),
    ...formPropTypes,
  }

  handleRemoveFromBlacklist (address: string) {
    return () => this.props.onRemoveFromBlacklist(address)
  }

  renderUser = (address) => {
    const { account } = this.props
    return (
      <div styleName='row' key={address}>
        <div styleName='iconBox'>
          <UserIcon styleName='icon' account={address} />
        </div>
        <div styleName='address'>{address}</div>
        {address !== account && (
          <div onTouchTap={this.handleRemoveFromBlacklist(address)} styleName='action' role='button'>
            <i className='material-icons'>delete</i>
          </div>
        )}
      </div>
    )
  }

  render () {
    const blacklist = this.props.blacklist.list().toArray()
    return (
      <form onSubmit={this.props.handleSubmit}>
        <div styleName='content'>
          <div styleName='row'>
            <div styleName='iconBox'>
              <i styleName='icon' className='material-icons'>account_circle</i>
            </div>
            <div styleName='address'>
              <Field
                component={TextField}
                name='userAddress'
                fullWidth
                hintText={<Translate value={`${prefix}.userAddress`} />}
              />
            </div>
            <div styleName='action'>
              <FlatButton
                type='submit'
                label={<Translate value={`${prefix}.addUserButton`} />}
              />
            </div>
          </div>

          {blacklist.map(this.renderUser)}

        </div>
      </form>
    )
  }
}
