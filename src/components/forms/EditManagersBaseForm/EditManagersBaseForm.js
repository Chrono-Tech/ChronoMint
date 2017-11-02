import { FlatButton } from 'material-ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import { Field, formPropTypes, reduxForm } from 'redux-form/immutable'
import './EditManagersBaseForm.scss'
import validate from './validate'

export const FORM_ASSET_MANAGER = 'AssetManagerDialog'

function prefix (token) {
  return 'Assets.AssetManagerForm.' + token
}

const onSubmit = (values) => {
  return values.get('managerAddress')
}

@reduxForm({form: FORM_ASSET_MANAGER, validate, onSubmit})
export default class EditManagersBase extends React.Component {
  static propTypes = {
    account: PropTypes.string.isRequired,
    managers: PropTypes.array,
  } & formPropTypes

  handleRemoveManager = (address) => {
    this.props.onRemove(address)
  }

  render () {
    return (
      <form styleName='root' onSubmit={this.props.handleSubmit}>
        <div styleName='header'><Translate value={prefix('dialogTitle')} /></div>
        <div styleName='content'>
          <div styleName='row'>
            <div styleName='iconBox'>
              <i styleName='icon' className='material-icons'>account_circle</i>
            </div>
            <div styleName='address'>
              <Field
                component={TextField}
                name='managerAddress'
                fullWidth
                hintText={<Translate value={prefix('managerAddress')} />}
              />
            </div>
            <div styleName='action'>
              <FlatButton
                type='submit'
                label={<Translate value={prefix('addManagersButton')} />}
              />
            </div>
          </div>
          {this.props.managers.map(item => (
            <div key={item} styleName='row'>
              <div styleName='iconBox'>
                <i styleName='icon' className='material-icons'>account_circle</i>
              </div>
              <div styleName='address'>{item}</div>
              {this.props.account !== item && (
                <div
                  onTouchTap={() => this.handleRemoveManager(item)}
                  styleName='action'
                >
                  <i className='material-icons'>delete</i>
                </div>
              )}
            </div>
          ))}
        </div>
      </form>
    )
  }
}
