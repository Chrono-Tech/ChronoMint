/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Button from 'components/common/ui/Button/Button'
import OwnerCollection from '@chronobank/core/models/wallet/OwnerCollection'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import { Field, formPropTypes, reduxForm } from 'redux-form/immutable'
import { DUCK_SESSION } from '@chronobank/core/redux/session/constants'
import { FORM_ASSET_MANAGER } from 'components/constants'

import './EditManagersBaseForm.scss'
import ManagerItem from './ManagerItem'
import validate from './validate'

function prefix (token) {
  return 'Assets.AssetManagerForm.' + token
}

const onSubmit = (values) => {
  return values.get('managerAddress')
}

function mapStateToProps (state) {
  return {
    account: state.get(DUCK_SESSION).account,
  }
}

@connect(mapStateToProps, null)
@reduxForm({ form: FORM_ASSET_MANAGER, validate, onSubmit })
export default class EditManagersBase extends PureComponent {
  static propTypes = {
    account: PropTypes.string,
    managers: PropTypes.instanceOf(OwnerCollection),
    ...formPropTypes,
  }

  renderManager = (manager) => (
    <ManagerItem
      key={manager.id()}
      manager={manager}
      account={this.props.account}
      onRemove={this.props.onRemove}
    />
  )

  render () {
    return (
      <form styleName='root' onSubmit={this.props.handleSubmit}>
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
              <Button
                flat
                type='submit'
                label={<Translate value={prefix('addManagersButton')} />}
              />
            </div>
          </div>
          {this.props.managers.items().map(this.renderManager)}
        </div>
      </form>
    )
  }
}
