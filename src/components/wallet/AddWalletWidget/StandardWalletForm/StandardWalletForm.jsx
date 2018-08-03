/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Button from 'components/common/ui/Button/Button'
import { Map } from 'immutable'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import { Field, formPropTypes, reduxForm } from 'redux-form/immutable'
import { createNewChildAddress, goToWallets, resetWalletsForm } from '@chronobank/core/redux/mainWallet/actions'
import { FORM_CUSTOM_WALLET_ADD } from 'components/constants'
import { prefix } from './lang'
import './StandardWalletForm.scss'

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: (values: Map) => {
      dispatch(createNewChildAddress({ blockchain: values.get('blockchain'), name: values.get('name') }))
      dispatch(goToWallets())
      dispatch(resetWalletsForm())
    },
  }
}

@connect(null, mapDispatchToProps)
@reduxForm({ form: FORM_CUSTOM_WALLET_ADD })
export default class StandardWalletForm extends PureComponent {
  static propTypes = {
    onCreateWallet: PropTypes.func,
    ...formPropTypes,
  }

  render () {
    const { handleSubmit } = this.props

    return (
      <form styleName='root' onSubmit={handleSubmit}>
        <div styleName='body'>
          <div styleName='nameBlock'>
            <Field
              component={TextField}
              name='name'
              fullWidth
              floatingLabelText={<Translate value={`${prefix}.name`} />}
            />
          </div>
        </div>
        <div styleName='actions'>
          <Button
            styleName='action'
            label={<Translate value={`${prefix}.addWallet`} />}
            type='submit'
          />
        </div>
      </form>
    )
  }
}
