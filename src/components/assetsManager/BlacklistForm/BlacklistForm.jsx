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
    ...formPropTypes,
  }

  handleRemoveFromBlacklist (address: string) {
    return () => this.props.onRemoveFromBlacklist(address)
  }

  renderUser () {
    const { account } = this.props
    const address = '0x236060666dbed392bb1f0b00b25e7c4b9cdcc4d5'
    return (
      <div styleName='row'>
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
          {/*{this.props.managers.items().map(this.renderManager)}*/}
          {this.renderUser()}
        </div>
      </form>
    )
  }
}
